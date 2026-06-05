import { GraphEngine } from '../../engines/graphEngine';
import { BuildInput } from '../../core/graph/GraphBuilder';

describe('GraphEngine', () => {
  let engine: GraphEngine;
  beforeEach(() => {
    engine = new GraphEngine();
  });

  test('buildGraph constructs graph', () => {
    const input: BuildInput = {
      nodes: [{ id: 'n1', type: 'test', label: 'Node1' }],
      edges: [],
    };
    engine.buildGraph(input);
    const node = engine.getNode('n1');
    expect(node).toBeDefined();
    expect(node?.id).toBe('n1');
  });

  test('traverseGraph performs traversal', () => {
    const input: BuildInput = {
      nodes: [
        { id: 'n1', type: 'test' },
        { id: 'n2', type: 'test' },
      ],
      edges: [{ from: 'n1', to: 'n2', type: 'causes' }],
    };
    engine.buildGraph(input);
    const result = engine.traverseGraph('n1', 'forward', 'bfs');
    expect(result).toContain('n2');
  });
});