import { GraphStore, GraphNode, GraphEdge } from '../../core/graph';
import { ImpactEngine } from '../../engines/impactEngine';

describe('ImpactEngine', () => {
  let store: GraphStore;
  let engine: ImpactEngine;
  beforeEach(() => {
    store = new GraphStore();
    store.addNode(new GraphNode('A', { id: 'A', type: 'service' }));
    store.addNode(new GraphNode('B', { id: 'B', type: 'service' }));
    store.addEdge(new GraphEdge('e1', { from: 'A', to: 'B', type: 'depends_on' }));
    engine = new ImpactEngine(store);
  });

  test('analyzeImpact returns report', () => {
    const node = store.getNode('A')!;
    const report = engine.analyzeImpact(node);
    expect(report.data.affectedNodes).toContain('B');
  });

  test('analyzeImpactById works', () => {
    const report = engine.analyzeImpactById('A');
    expect(report.data.rootNode).toBe('A');
  });
});