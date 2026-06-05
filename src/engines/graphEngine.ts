// engines/graphEngine.ts
import { GraphBuilder, GraphStore, GraphTraversal, BuildInput } from '../core/graph';
import { GraphNode } from '../core/graph/GraphNode';

/**
 * Orchestrates graph construction, storage, and traversal.
 */
export class GraphEngine {
  private builder: GraphBuilder;
  private store: GraphStore;
  private traversal: GraphTraversal;

  constructor() {
    this.store = new GraphStore();
    this.builder = new GraphBuilder(this.store);
    this.traversal = new GraphTraversal(this.store);
  }

  /**
   * Builds a graph from raw input data.
   * @param input UIR-compatible build input containing nodes and edges.
   */
  buildGraph(input: BuildInput): void {
    this.builder.rebuild(input);
  }

  /**
   * Returns the underlying graph store (for inspection or external use).
   */
  getStore(): GraphStore {
    return this.store;
  }

  /**
   * Performs a traversal from a start node.
   * @param startId Node ID to start from.
   * @param direction 'forward' (outgoing) or 'backward' (incoming).
   * @param method 'bfs' or 'dfs'.
   */
  traverseGraph(startId: string, direction: 'forward' | 'backward' = 'forward', method: 'bfs' | 'dfs' = 'bfs'): string[] {
    if (method === 'bfs') {
      return this.traversal.bfs(startId, direction);
    } else {
      return this.traversal.dfs(startId, direction);
    }
  }

  /**
   * Retrieves a node by ID.
   */
  getNode(id: string): GraphNode | undefined {
    return this.store.getNode(id);
  }

  /**
   * Clears the graph.
   */
  clearGraph(): void {
    this.store.clear();
  }
}