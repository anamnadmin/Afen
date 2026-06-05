import { GraphStore, GraphNode, GraphEdge } from '../../core/graph';
import { CandidateRanker, RootCauseAnalyzer } from '../../core/rootCause';

describe('CandidateRanker', () => {
  let ranker: CandidateRanker;
  beforeEach(() => {
    ranker = new CandidateRanker();
  });

  test('ranks by score descending', () => {
    const candidates = [
      { nodeId: 'A', score: 0.5, confidence: 0.8, evidence: [] },
      { nodeId: 'B', score: 0.9, confidence: 0.9, evidence: [] },
    ];
    const ranked = ranker.rank(candidates);
    expect(ranked[0].nodeId).toBe('B');
    expect(ranked[1].nodeId).toBe('A');
  });
});

describe('RootCauseAnalyzer', () => {
  let store: GraphStore;
  let analyzer: RootCauseAnalyzer;
  beforeEach(() => {
    store = new GraphStore();
    store.addNode(new GraphNode('A', { id: 'A', type: 'error' }));
    store.addNode(new GraphNode('B', { id: 'B', type: 'cause' }));
    store.addEdge(new GraphEdge('e1', { from: 'B', to: 'A', type: 'causes' }));
    analyzer = new RootCauseAnalyzer(store);
  });

  test('finds root cause candidates', () => {
    const report = analyzer.analyze({ errorNodeId: 'A', maxDepth: 5 });
    expect(report.rankedCandidates).toHaveLength(1);
    expect(report.rankedCandidates[0].nodeId).toBe('B');
  });
});