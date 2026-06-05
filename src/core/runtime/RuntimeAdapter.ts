export interface RuntimeEvent {
  id: string;
  type: string;
  timestamp: number;
  source: string;
  data: Record<string, any>;
}

/**
 * Abstract adapter for runtime data sources (logs, metrics, traces).
 */
export interface RuntimeAdapter {
  fetchEvents(sinceTimestamp?: number): Promise<RuntimeEvent[]>;
  streamEvents(callback: (event: RuntimeEvent) => void): () => void;
}