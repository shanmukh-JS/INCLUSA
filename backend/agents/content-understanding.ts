/**
 * Agent 1 — Multimodal Content Understanding Agent (Unified Backend Re-export)
 */

import { ContentUnderstandingAgent, contentUnderstandingAgent } from '../../lib/agents/content-understanding';
import type { ContentUnderstandingInput } from '../../lib/agents/content-understanding';

export type IngestionInput = ContentUnderstandingInput;
export type { ContentUnderstandingInput };
export { ContentUnderstandingAgent, contentUnderstandingAgent };
