import { RuntimeAdapter, RuntimeEvent } from './RuntimeAdapter';

export class RuntimeCollector {
  private events: RuntimeEvent[] = [];

  constructor(private adapter: RuntimeAdapter) {}

  async collect(sinceTimestamp?: number): Promise<void> {
    const newEvents = await this.adapter.fetchEvents(sinceTimestamp);
    this.events.push(...newEvents);
  }

  getEvents(): RuntimeEvent[] {
    return [...this.events];
  }

  clear(): void {
    this.events = [];
  }
}