import { GraphStore, GraphNode, GraphEdge } from '../../core/graph';
import { RootCauseEngine, FaultEvent } from '../../engines/rootCauseEngine';

describe('RootCauseEngine', () => {
  let store: GraphStore;
  let engine: RootCauseEngine;
  beforeEach(() => {
    store = new GraphStore();
    store.addNode(new GraphNode('err', { id: 'err', type: 'error' }));
    store.addNode(new GraphNode('cause', { id: 'cause', type: 'config' }));
    store.addEdge(new GraphEdge('e1', { from: 'cause', to: 'err', type: 'causes' }));
    engine = new RootCauseEngine(store);
  });

  test('findRootCause returns report with candidate', () => {
    const event: FaultEvent = {
      id: 'event1',
      type: 'timeout',
      timestamp: Date.now(),
      nodeId: 'err',
      details: {},
    };
    const report = engine.findRootCause(event);
    expect(report.rankedCandidates).toHaveLength(1);
    expect(report.rankedCandidates[0].nodeId).toBe('cause');
  });
});