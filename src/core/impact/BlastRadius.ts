import { GraphStore } from '../graph/GraphStore';
import { GraphTraversal } from '../graph/GraphTraversal';

/**
 * Calculates the set of nodes potentially affected by a failure.
 */
export class BlastRadius {
  private traversal: GraphTraversal;
  constructor(private store: GraphStore) {
    this.traversal = new GraphTraversal(store);
  }

  /**
   * Returns IDs of all nodes reachable from the given failed node (forward propagation).
   */
  calculate(failedNodeId: string, maxDepth = 10): string[] {
    const bfsOrder = this.traversal.bfs(failedNodeId, 'forward');
    // Limit by depth
    const depthMap = new Map<string, number>();
    depthMap.set(failedNodeId, 0);
    const result: string[] = [];
    for (const nodeId of bfsOrder) {
      const depth = depthMap.get(nodeId) ?? 0;
      if (depth <= maxDepth && nodeId !== failedNodeId) {
        result.push(nodeId);
      }
      for (const edge of this.store.getOutgoingEdges(nodeId)) {
        const child = edge.data.to;
        if (!depthMap.has(child)) {
          depthMap.set(child, depth + 1);
        }
      }
    }
    return result;
  }
}