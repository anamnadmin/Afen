import { GraphStore, GraphNode, GraphEdge } from '../../core/graph';
import { Parser } from '../../queries/parser';
import { Executor } from '../../queries/executor';

describe('Query Pipeline Integration', () => {
  let graphStore: GraphStore;
  let executor: Executor;

  beforeEach(() => {
    graphStore = new GraphStore();
    const nodeA = new GraphNode('error1', { id: 'error1', type: 'error', label: 'DB Timeout' });
    const nodeB = new GraphNode('cause1', { id: 'cause1', type: 'config', label: 'Connection Pool Size' });
    graphStore.addNode(nodeA);
    graphStore.addNode(nodeB);
    graphStore.addEdge(new GraphEdge('e1', { from: 'cause1', to: 'error1', type: 'causes' }));
    executor = new Executor(graphStore);
  });

  test('Parse and execute TRACE query', async () => {
    const parser = new Parser();
    const ast = parser.parse('TRACE error1 MAX_DEPTH 5');
    const result = await executor.execute(ast);
    expect(result.success).toBe(true);
    expect(result.data?.command).toBe('TRACE');
    expect(result.data?.output.chain).toBeDefined();
  });

  test('Parse and execute CAUSE query', async () => {
    const parser = new Parser();
    const ast = parser.parse('CAUSE error1');
    const result = await executor.execute(ast);
    expect(result.success).toBe(true);
    expect(result.data?.output.candidates).toBeDefined();
  });

  test('Parse and execute EXPLAIN query', async () => {
    const parser = new Parser();
    const ast = parser.parse('EXPLAIN error1 FORMAT "text"');
    const result = await executor.execute(ast);
    expect(result.success).toBe(true);
    expect(result.data?.output.rootCause).toBeDefined();
  });
});