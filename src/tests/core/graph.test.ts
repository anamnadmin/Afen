import { GraphNode, GraphEdge, GraphStore, GraphTraversal } from '../../core/graph';

describe('GraphNode', () => {
  test('creates node with id and data', () => {
    const node = new GraphNode('n1', { id: 'n1', type: 'test', label: 'Test' });
    expect(node.id).toBe('n1');
    expect(node.data.type).toBe('test');
  });
});

describe('GraphEdge', () => {
  test('creates edge with from/to', () => {
    const edge = new GraphEdge('e1', { from: 'n1', to: 'n2', type: 'causes' });
    expect(edge.data.from).toBe('n1');
    expect(edge.data.to).toBe('n2');
  });
});

describe('GraphStore', () => {
  let store: GraphStore;
  beforeEach(() => {
    store = new GraphStore();
    store.addNode(new GraphNode('n1', { id: 'n1', type: 'test' }));
    store.addNode(new GraphNode('n2', { id: 'n2', type: 'test' }));
    store.addEdge(new GraphEdge('e1', { from: 'n1', to: 'n2', type: 'causes' }));
  });

  test('getNode returns node', () => {
    expect(store.getNode('n1')).toBeDefined();
    expect(store.getNode('missing')).toBeUndefined();
  });

  test('getOutgoingEdges returns edges from node', () => {
    const edges = store.getOutgoingEdges('n1');
    expect(edges).toHaveLength(1);
    expect(edges[0].data.to).toBe('n2');
  });

  test('getIncomingEdges returns edges to node', () => {
    const edges = store.getIncomingEdges('n2');
    expect(edges).toHaveLength(1);
    expect(edges[0].data.from).toBe('n1');
  });
});

describe('GraphTraversal', () => {
  let store: GraphStore;
  let traversal: GraphTraversal;
  beforeEach(() => {
    store = new GraphStore();
    store.addNode(new GraphNode('n1', { id: 'n1', type: 'test' }));
    store.addNode(new GraphNode('n2', { id: 'n2', type: 'test' }));
    store.addNode(new GraphNode('n3', { id: 'n3', type: 'test' }));
    store.addEdge(new GraphEdge('e1', { from: 'n1', to: 'n2', type: 'causes' }));
    store.addEdge(new GraphEdge('e2', { from: 'n2', to: 'n3', type: 'causes' }));
    traversal = new GraphTraversal(store);
  });

  test('bfs returns nodes in BFS order', () => {
    const order = traversal.bfs('n1', 'forward');
    expect(order).toEqual(['n1', 'n2', 'n3']);
  });

  test('dfs returns nodes in DFS order', () => {
    const order = traversal.dfs('n1', 'forward');
    expect(order).toEqual(['n1', 'n2', 'n3']);
  });

  test('backward traversal works', () => {
    const order = traversal.bfs('n3', 'backward');
    expect(order).toContain('n2');
    expect(order).toContain('n1');
  });
});