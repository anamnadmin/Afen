import { GraphStore, GraphNode, GraphEdge } from '../../core/graph';
import { BlastRadius, ImpactAnalyzer } from '../../core/impact';

describe('BlastRadius', () => {
  let store: GraphStore;
  let blastRadius: BlastRadius;
  beforeEach(() => {
    store = new GraphStore();
    store.addNode(new GraphNode('A', { id: 'A', type: 'service' }));
    store.addNode(new GraphNode('B', { id: 'B', type: 'service' }));
    store.addNode(new GraphNode('C', { id: 'C', type: 'service' }));
    store.addEdge(new GraphEdge('e1', { from: 'A', to: 'B', type: 'depends_on' }));
    store.addEdge(new GraphEdge('e2', { from: 'B', to: 'C', type: 'depends_on' }));
    blastRadius = new BlastRadius(store);
  });

  test('calculate returns affected nodes', () => {
    const affected = blastRadius.calculate('A', 5);
    expect(affected).toContain('B');
    expect(affected).toContain('C');
  });

  test('calculate respects maxDepth', () => {
    const affected = blastRadius.calculate('A', 1);
    expect(affected).toContain('B');
    expect(affected).not.toContain('C');
  });
});

describe('ImpactAnalyzer', () => {
  let store: GraphStore;
  let analyzer: ImpactAnalyzer;
  let blastRadius: BlastRadius;
  beforeEach(() => {
    store = new GraphStore();
    store.addNode(new GraphNode('A', { id: 'A', type: 'service' }));
    store.addNode(new GraphNode('B', { id: 'B', type: 'service' }));
    store.addEdge(new GraphEdge('e1', { from: 'A', to: 'B', type: 'depends_on' }));
    blastRadius = new BlastRadius(store);
    analyzer = new ImpactAnalyzer(blastRadius);
  });

  test('analyze returns impact report with severity', () => {
    const report = analyzer.analyze({ failedNodeId: 'A' });
    expect(report.data.rootNode).toBe('A');
    expect(report.data.affectedNodes).toContain('B');
    expect(report.data.severity).toBeDefined();
  });
});