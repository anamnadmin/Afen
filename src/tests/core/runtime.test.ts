import { RuntimeCollector, RuntimeWatcher } from '../../core/runtime';
import { RuntimeAdapter, RuntimeEvent } from '../../core/runtime/RuntimeAdapter';

class MockAdapter implements RuntimeAdapter {
  async fetchEvents(_sinceTimestamp?: number): Promise<RuntimeEvent[]> {
    return [{ id: '1', type: 'test', timestamp: Date.now(), source: 'mock', data: {} }];
  }
  streamEvents(callback: (event: RuntimeEvent) => void): () => void {
    callback({ id: 'stream', type: 'test', timestamp: Date.now(), source: 'mock', data: {} });
    return () => {};
  }
}

describe('RuntimeCollector', () => {
  test('collects events from adapter', async () => {
    const adapter = new MockAdapter();
    const collector = new RuntimeCollector(adapter);
    await collector.collect();
    expect(collector.getEvents()).toHaveLength(1);
  });
});

describe('RuntimeWatcher', () => {
  test('starts and stops watching', () => {
    const adapter = new MockAdapter();
    const watcher = new RuntimeWatcher(adapter);
    const callback = jest.fn();
    watcher.onEvent(callback);
    watcher.start();
    watcher.stop();
    expect(callback).toHaveBeenCalled();
  });
});