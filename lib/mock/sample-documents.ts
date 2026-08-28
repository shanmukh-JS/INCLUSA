import { DocumentInputType } from '@/types';

export interface SampleDocumentItem {
  id: string;
  title: string;
  inputType: DocumentInputType;
  fileName: string;
  description: string;
  rawText: string;
  tag: string;
}

export const SAMPLE_DOCUMENTS: SampleDocumentItem[] = [
  {
    id: 'demo-finance-report',
    title: 'Enterprise Annual Financial & Growth Strategy 2025',
    inputType: 'pdf',
    fileName: 'Annual_Strategy_Report_2025.pdf',
    tag: 'Complex PDF & Charts',
    description: 'Quarterly financial report featuring multi-column data, unlabelled growth charts, dense economic jargon, and low-contrast footnotes.',
    rawText: `# Enterprise Annual Financial & Growth Strategy 2025

## Executive Strategic Overview
The consolidated enterprise operations for fiscal year 2024-2025 demonstrate unprecedented market acceleration across all multi-regional sectors. Notwithstanding macroeconomic headwinds and supply chain volatility, total capitalized operational revenue exceeded preliminary projections.

## Section 2: Quarterly Performance & Revenue Progression
Quarterly revenue grew steadily throughout all four reporting intervals. The trajectory culminated in a record fourth quarter performance.

[Visual Figure 1: Quarterly Revenue Trajectory Bar Chart - Q1: $100M, Q2: $125M, Q3: $155M, Q4: $185M]

The sustained 85% net trajectory between Q1 baseline and Q4 peak was primarily catalyzed by cloud infrastructure adoption and enterprise automation suites.

## Section 3: Detailed Segment Breakdown Table
| Operational Sector | Q1 Actual ($M) | Q2 Actual ($M) | Q3 Actual ($M) | Q4 Actual ($M) | YoY Delta |
| Enterprise Cloud | 45.0 | 58.2 | 74.1 | 92.5 | +105.5% |
| Cybersecurity Suite | 30.0 | 36.5 | 44.0 | 51.5 | +71.6% |
| Professional Services | 25.0 | 30.3 | 36.9 | 41.0 | +64.0% |

## Section 4: Accessibility & Future Mandates
* Deploy universal digital accessibility standards across all customer touchpoints.
* Ensure automated verification pipelines monitor all internal and external publications.
* Guarantee multi-lingual availability in Telugu, Hindi, and regional dialects for all citizen-facing services.`,
  },
  {
    id: 'demo-clinical-research',
    title: 'Clinical Neurology & Cognitive Processing Study',
    inputType: 'docx',
    fileName: 'Clinical_Neurology_Study_v4.docx',
    tag: 'Academic & Medical',
    description: 'Dense medical research paper with 16th-grade readability, complex acronyms, neuroimaging diagrams, and missing headings.',
    rawText: `# Clinical Neurology & Cognitive Processing Study

## Abstract & Pathophysiological Hypotheses
The pathophysiological manifestations of neurodegenerative demyelination in frontotemporal cortices induce significant degradation of synaptic neurotransmission velocities. Furthermore, neuroinflammatory cytokine cascades exacerbate microglial hyperactivation.

## Methods & Cohort Stratification
Cohort selection comprised 450 randomized participants stratified across age-matched control demographics. Neuroimaging protocols included functional magnetic resonance imaging (fMRI) and magnetoencephalography (MEG).

[Visual Figure 1: Cortical Activation Map across Prefrontal Cortex during Working Memory Tasks]

## Key Findings Table
| Biomarker Index | Control Group (Mean) | Study Cohort (Mean) | P-Value Significance |
| Neurofilament Light (NfL) | 12.4 pg/mL | 48.7 pg/mL | p < 0.001 |
| Glial Fibrillary Protein | 85.2 pg/mL | 210.6 pg/mL | p < 0.001 |
| Total Tau Protein | 140.0 pg/mL | 390.4 pg/mL | p < 0.002 |

## Recommendations
Therapeutic intervention should prioritize early microglial stabilization and targeted neuroprotective regimens.`,
  },
  {
    id: 'demo-health-advisory',
    title: 'Public Health & Monsoon Preparedness Advisory',
    inputType: 'text',
    fileName: 'Public_Health_Advisory.txt',
    tag: 'Multilingual & Public Notice',
    description: 'Crucial public health notice requiring immediate plain-language simplification and Telugu/Hindi translation.',
    rawText: `# Public Health & Monsoon Preparedness Advisory

## Immediate Action Items for Community Health
Seasonal heavy precipitation increases vector-borne pathogen transmission risks including dengue, malaria, and waterborne gastrointestinal infections. 

## Preventive Health Measures
* Eliminate all stagnant water reservoirs around residential perimeters within 24 hours.
* Boil drinking water for a minimum of three minutes prior to consumption.
* Utilize barrier netting and approved repellent compounds during dusk and dawn hours.
* Report persistent febrile symptoms accompanied by arthralgia to municipal primary health centers immediately.

## Emergency Contacts
Emergency Medical Hotline: 108
Public Sanitation Desk: 104
Direct Health Advisory Portal: https://health.gov.in/monsoon-safety`,
  },
  {
    id: 'demo-tech-keynote',
    title: 'Next-Gen AI & Universal Accessibility Keynote',
    inputType: 'audio',
    fileName: 'Keynote_Presentation_Audio.mp3',
    tag: 'Audio/Video & Speech',
    description: 'Keynote presentation recording requiring speech-to-text transcript, speaker labels, and synchronized WebVTT captions.',
    rawText: `[Speaker 1 - Host]: Welcome everyone to the global launch of INCLUSA.
[Speaker 2 - Accessibility Lead]: Today we are solving one of humanity's most persistent digital challenges: making every document, image, audio track, and video equally accessible to every human being on earth.
[Speaker 2 - Accessibility Lead]: Traditional tools only tell you what is broken. INCLUSA uses agentic multimodal AI to not only audit barriers, but actively reconstruct and verify accessible versions in real time.
[Speaker 1 - Host]: Let us begin by demonstrating the live 6-agent pipeline on a complex multi-modal file.`,
  },
];
