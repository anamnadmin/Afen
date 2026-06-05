import { DependencyGraph, DependencyResolver } from '../../core/dependency';

describe('DependencyGraph', () => {
  let graph: DependencyGraph<string>;

  beforeEach(() => {
    graph = new DependencyGraph<string>();
  });

  test('addNode adds a node', () => {
    graph.addNode('A', 'dataA');
    expect(graph.getNodeData('A')).toBe('dataA');
  });

  test('addDependency creates edges', () => {
    graph.addNode('A');
    graph.addNode('B');
    graph.addDependency('A', 'B');
    expect(graph.getDirectDependencies('A')).toContain('B');
    expect(graph.getDirectDependents('B')).toContain('A');
  });

  test('getTransitiveDependencies returns deep dependencies', () => {
    graph.addNode('A');
    graph.addNode('B');
    graph.addNode('C');
    graph.addDependency('A', 'B');
    graph.addDependency('B', 'C');
    const deps = graph.getTransitiveDependencies('A');
    expect(deps).toContain('B');
    expect(deps).toContain('C');
  });

  test('topologicalSort returns correct order', () => {
    graph.addNode('A');
    graph.addNode('B');
    graph.addNode('C');
    graph.addDependency('A', 'B');
    graph.addDependency('B', 'C');
    const order = graph.topologicalSort();
    // Dependencies should come first: C (no outgoing), then B, then A
    expect(order).toEqual(['C', 'B', 'A']);
  });

  test('topologicalSort throws on cycle', () => {
    graph.addNode('A');
    graph.addNode('B');
    graph.addDependency('A', 'B');
    graph.addDependency('B', 'A');
    expect(() => graph.topologicalSort()).toThrow('Cycle detected');
  });
});

describe('DependencyResolver', () => {
  let graph: DependencyGraph<string>;
  let resolver: DependencyResolver;

  beforeEach(() => {
    graph = new DependencyGraph<string>();
    graph.addNode('A');
    graph.addNode('B');
    graph.addNode('C');
    graph.addDependency('A', 'B');
    graph.addDependency('B', 'C');
    resolver = new DependencyResolver(graph);
  });

  test('resolve returns correct resolution order for target', () => {
    const result = resolver.resolve('A');
    expect(result.id).toBe('A');
    expect(result.resolutionOrder).toContain('C');
    expect(result.resolutionOrder).toContain('B');
    expect(result.resolutionOrder).toContain('A');
    expect(result.missingDependencies).toHaveLength(0);
  });

  test('resolve returns missing dependencies if node not found', () => {
    const result = resolver.resolve('A');
    expect(result.missingDependencies).toEqual([]);
  });

  test('resolveAll returns topological order', () => {
    const all = resolver.resolveAll();
    expect(all).toEqual(['C', 'B', 'A']);
  });
});