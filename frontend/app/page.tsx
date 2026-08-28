'use client';

import React from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { TheProblemSection } from '@/components/landing/TheProblemSection';
import { MultimodalFeatureMatrix } from '@/components/landing/MultimodalFeatureMatrix';
import { WhyInclusaSection } from '@/components/landing/WhyInclusaSection';
import { SixAgentsSection } from '@/components/landing/SixAgentsSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { DocumentDemoSection } from '@/components/landing/DocumentDemoSection';
import { WhoBenefitsSection } from '@/components/landing/WhoBenefitsSection';
import { VerificationSection } from '@/components/landing/VerificationSection';
import { MultilingualSection } from '@/components/landing/MultilingualSection';
import { WebsiteAnalyzerPromo } from '@/components/landing/WebsiteAnalyzerPromo';
import { SmartAssistantPromo } from '@/components/landing/SmartAssistantPromo';
import { ImpactSection } from '@/components/landing/ImpactSection';
import { AboutInclusaSection } from '@/components/landing/AboutInclusaSection';
import { FinalCtaSection } from '@/components/landing/FinalCtaSection';

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col w-full">
      {/* 1. Hero & 1-Click Interactive Demo Selector */}
      <HeroSection />

      {/* 2. The Problem: Information is Digital. Access Isn't Always. */}
      <TheProblemSection />

      {/* 3. One AI. Many Ways to Access (6 Capabilities) */}
      <MultimodalFeatureMatrix />

      {/* 4. Why INCLUSA: Beyond Passive Checkers (Differentiator) */}
      <WhyInclusaSection />

      {/* 5. Six AI Agents. One Goal. */}
      <SixAgentsSection />

      {/* 6. How It Works: 3-Step Illustrated Guide */}
      <HowItWorksSection />

      {/* 7. Watch INCLUSA Make a Document Accessible (Interactive Mockup) */}
      <DocumentDemoSection />

      {/* 8. Built Around Real Access Needs (Personas) */}
      <WhoBenefitsSection />

      {/* 9. We Don't Just Fix It. We Check. (Verification Engine) */}
      <VerificationSection />

      {/* 10. Same Information. More Ways to Understand It. (Multilingual) */}
      <MultilingualSection />

      {/* 11. What About Websites? */}
      <WebsiteAnalyzerPromo />

      {/* 12. Don't Know Where to Start? Meet INCLUSA Assistant */}
      <SmartAssistantPromo />

      {/* 13. Designed for Everyone (Impact) */}
      <ImpactSection />

      {/* 14. Why We Built INCLUSA */}
      <AboutInclusaSection />

      {/* 15. Final Call to Action */}
      <FinalCtaSection />
    </div>
  );
}
