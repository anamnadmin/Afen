import { DependencyGraph } from './DependencyGraph';

export interface ResolvedDependency {
  id: string;
  resolutionOrder: string[];
  missingDependencies: string[];
}

/**
 * Resolves dependencies by producing an execution/construction order.
 */
export class DependencyResolver {
  constructor(private graph: DependencyGraph) {}

  /**
   * Resolves a specific node: returns all dependencies in order + any missing ones.
   * @param targetId Node for which to resolve dependencies.
   */
  resolve(targetId: string): ResolvedDependency {
    if (!this.graph.getAllNodeIds().includes(targetId)) {
      throw new Error(`Node ${targetId} not found in graph`);
    }
    const transitive = this.graph.getTransitiveDependencies(targetId);
    const allNodes = this.graph.getAllNodeIds();
    const missing = Array.from(transitive).filter(id => !allNodes.includes(id));
    let resolutionOrder: string[] = [];
    try {
      const fullOrder = this.graph.topologicalSort();
      // Filter to only those relevant to target (including target itself)
      const relevant = new Set([targetId, ...transitive]);
      resolutionOrder = fullOrder.filter(id => relevant.has(id));
    } catch (e) {
      // Cycle exists, fallback to simple BFS order
      resolutionOrder = [targetId, ...transitive];
    }
    return {
      id: targetId,
      resolutionOrder,
      missingDependencies: missing,
    };
  }

  /**
   * Resolves all nodes in graph and returns a global order.
   */
  resolveAll(): string[] {
    return this.graph.topologicalSort();
  }
}