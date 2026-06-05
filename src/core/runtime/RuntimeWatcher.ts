import { RuntimeAdapter, RuntimeEvent } from './RuntimeAdapter';

export type RuntimeWatcherCallback = (event: RuntimeEvent) => void;

export class RuntimeWatcher {
  private listeners: Set<RuntimeWatcherCallback> = new Set();
  private cleanup?: () => void;

  constructor(private adapter: RuntimeAdapter) {}

  start(): void {
    if (this.cleanup) return;
    this.cleanup = this.adapter.streamEvents((event) => {
      for (const listener of this.listeners) {
        listener(event);
      }
    });
  }

  stop(): void {
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = undefined;
    }
  }

  onEvent(callback: RuntimeWatcherCallback): void {
    this.listeners.add(callback);
  }

  offEvent(callback: RuntimeWatcherCallback): void {
    this.listeners.delete(callback);
  }
}