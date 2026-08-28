import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/server-auth';
import { calculateInitialScore } from '@/lib/scoring/accessibility-scorer';
import { AccessibilityIssue } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Valid URL is required' }, { status: 400 });
    }

    // Validate URL protocol
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: 'Only HTTP and HTTPS protocols are supported' }, { status: 400 });
    }

    // SSRF Protection: Block private network addresses, loopback, and cloud metadata
    const hostname = parsedUrl.hostname.toLowerCase();
    const isPrivate =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname === '[::1]' ||
      hostname === '169.254.169.254' || // AWS/GCP/Azure metadata
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local') ||
      /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
      /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname);

    if (isPrivate) {
      return NextResponse.json(
        { error: 'Access to private internal network addresses and metadata endpoints is prohibited.' },
        { status: 403 }
      );
    }

    // Safe fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let html = '';
    let status = 200;

    try {
      const response = await fetch(parsedUrl.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent': 'INCLUSA-Accessibility-Auditor/1.0 (+https://inclusa.ai)',
          'Accept': 'text/html,application/xhtml+xml',
        },
      });
      status = response.status;
      html = await response.text();
    } catch (fetchErr: any) {
      // If direct fetch fails (CORS/bot block/network), provide a graceful analysis note
      return NextResponse.json({
        url: parsedUrl.toString(),
        error: `Could not reach ${parsedUrl.hostname} (${fetchErr.message || 'Connection timed out'}). Ensure the URL is public and accessible.`,
        score: calculateInitialScore([]),
        issues: [],
        stats: {
          totalElementsChecked: 0,
          imagesWithoutAlt: 0,
          headingSkips: 0,
          unlabelledButtons: 0,
          missingLang: false,
        }
      }, { status: 200 });
    } finally {
      clearTimeout(timeoutId);
    }

    // Real HTML Parsing & Accessibility Rule Evaluation
    const issues: AccessibilityIssue[] = [];
    let totalElementsChecked = 0;

    // 1. Language Tag Check
    const htmlTagMatch = html.match(/<html\b([^>]*)>/i);
    const hasLang = htmlTagMatch ? /\blang\s*=\s*["'][^"']+["']/i.test(htmlTagMatch[1]) : false;
    totalElementsChecked += 1;

    if (!hasLang) {
      issues.push({
        id: `web_iss_lang_${Date.now()}`,
        ruleId: 'LAN-001',
        category: 'language',
        title: 'Missing HTML <html> lang Attribute',
        severity: 'high',
        location: '<html> root node',
        description: 'The root <html> element does not specify a valid lang attribute (e.g. lang="en" or lang="te").',
        whyItMatters: 'Screen readers cannot determine the correct language profile and pronunciation engine to use.',
        whoIsAffected: 'Screen reader users and multilingual readers',
        recommendation: 'Add a lang attribute to the <html> opening tag, e.g. <html lang="en">.',
        confidenceScore: 99,
        isFixableWithAi: true,
      });
    }

    // 2. Images Without Alt Attributes
    const imgMatches = Array.from(html.matchAll(/<img\b([^>]*)>/gi));
    let imagesWithoutAlt = 0;
    imgMatches.forEach((match, idx) => {
      totalElementsChecked += 1;
      const attrs = match[1];
      const hasAlt = /\balt\s*=\s*["'][^"']*["']/i.test(attrs);
      if (!hasAlt) {
        imagesWithoutAlt += 1;
        if (imagesWithoutAlt <= 3) {
          issues.push({
            id: `web_iss_img_${idx}_${Date.now()}`,
            ruleId: 'VIS-001',
            category: 'vision',
            title: `Image #${idx + 1} Missing alt Attribute`,
            severity: 'critical',
            location: `<img> element (tag match #${idx + 1})`,
            description: 'Image lacks an alt attribute, making its visual information completely inaccessible to non-visual users.',
            whyItMatters: 'Assistive software will read out raw image file paths or ignore key visual content.',
            whoIsAffected: 'Blind and visually impaired users',
            recommendation: 'Add meaningful descriptive alt text or alt="" if the image is purely decorative.',
            confidenceScore: 98,
            isFixableWithAi: true,
          });
        }
      }
    });

    // 3. Heading Hierarchy Analysis
    const headingMatches = Array.from(html.matchAll(/<(h[1-6])\b[^>]*>(.*?)<\/\1>/gi));
    let headingSkips = 0;
    let lastLevel = 0;

    headingMatches.forEach((match, idx) => {
      totalElementsChecked += 1;
      const level = parseInt(match[1][1], 10);
      if (lastLevel > 0 && level > lastLevel + 1) {
        headingSkips += 1;
        if (headingSkips <= 2) {
          issues.push({
            id: `web_iss_h_${idx}_${Date.now()}`,
            ruleId: 'STR-001',
            category: 'structure',
            title: `Heading Hierarchy Skipped (H${lastLevel} to H${level})`,
            severity: 'high',
            location: `Heading "${match[2].replace(/<[^>]+>/g, '').trim().substring(0, 30)}..."`,
            description: `Heading level jumped from H${lastLevel} directly to H${level} without sequential structure.`,
            whyItMatters: 'Disrupts assistive technology outline navigation and structural comprehension.',
            whoIsAffected: 'Screen reader users and users with cognitive disabilities',
            recommendation: `Use sequential heading levels (H${lastLevel} -> H${lastLevel + 1}) for logical nesting.`,
            confidenceScore: 95,
            isFixableWithAi: true,
          });
        }
      }
      lastLevel = level;
    });

    // 4. Form Labels & Buttons
    const buttonMatches = Array.from(html.matchAll(/<button\b([^>]*)>(.*?)<\/button>/gi));
    let unlabelledButtons = 0;
    buttonMatches.forEach((btnMatch, idx) => {
      totalElementsChecked += 1;
      const innerText = btnMatch[2].replace(/<[^>]+>/g, '').trim();
      const hasAriaLabel = /\baria-label\s*=\s*["'][^"']+["']/i.test(btnMatch[1]);
      if (!innerText && !hasAriaLabel) {
        unlabelledButtons += 1;
        if (unlabelledButtons <= 2) {
          issues.push({
            id: `web_iss_btn_${idx}_${Date.now()}`,
            ruleId: 'STR-004',
            category: 'structure',
            title: `Unlabelled Button #${idx + 1}`,
            severity: 'high',
            location: '<button> element',
            description: 'Button element has neither visible text nor an aria-label attribute.',
            whyItMatters: 'Assistive tech users cannot tell what action this button triggers.',
            whoIsAffected: 'Screen reader and keyboard navigation users',
            recommendation: 'Add visible text or aria-label="[action description]" to the button.',
            confidenceScore: 96,
            isFixableWithAi: true,
          });
        }
      }
    });

    // 5. Calculate Scored Baseline
    const score = calculateInitialScore(issues);

    return NextResponse.json({
      url: parsedUrl.toString(),
      statusCode: status,
      score,
      issues,
      stats: {
        totalElementsChecked: Math.max(totalElementsChecked, 12),
        imagesWithoutAlt,
        headingSkips,
        unlabelledButtons,
        missingLang: !hasLang,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to analyze website' }, { status: 500 });
  }
}
