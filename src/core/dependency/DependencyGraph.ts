/**
 * Represents a directed dependency graph.
 * Nodes are identified by string keys, edges represent "depends on" relationships.
 */
export class DependencyGraph<T = any> {
  private nodes: Map<string, T> = new Map();
  private dependencies: Map<string, Set<string>> = new Map(); // node -> set of nodes it depends on
  private dependents: Map<string, Set<string>> = new Map();   // node -> set of nodes that depend on it

  addNode(id: string, data?: T): void {
    if (!this.nodes.has(id)) {
      this.nodes.set(id, data as T);
      this.dependencies.set(id, new Set());
      this.dependents.set(id, new Set());
    }
  }

  addDependency(from: string, to: string): void {
    if (!this.nodes.has(from) || !this.nodes.has(to)) {
      throw new Error(`Cannot add dependency: node ${from} or ${to} not found`);
    }
    this.dependencies.get(from)!.add(to);
    this.dependents.get(to)!.add(from);
  }

  getDirectDependencies(nodeId: string): Set<string> {
    return new Set(this.dependencies.get(nodeId) || []);
  }

  getDirectDependents(nodeId: string): Set<string> {
    return new Set(this.dependents.get(nodeId) || []);
  }

  getTransitiveDependencies(nodeId: string): Set<string> {
    const result = new Set<string>();
    const stack = [nodeId];
    const visited = new Set<string>();
    while (stack.length) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;
      visited.add(current);
      const deps = this.dependencies.get(current) || new Set();
      for (const dep of deps) {
        result.add(dep);
        if (!visited.has(dep)) stack.push(dep);
      }
    }
    result.delete(nodeId);
    return result;
  }

  getNodeData(id: string): T | undefined {
    return this.nodes.get(id);
  }

  getAllNodeIds(): string[] {
    return Array.from(this.nodes.keys());
  }

  /**
   * Returns a topological ordering where dependencies appear before dependents.
   * Example: A -> B -> C  =>  returns [C, B, A]
   */
  topologicalSort(): string[] {
    const inDegree = new Map<string, number>();
    // in-degree = number of nodes that depend on this node (incoming edges)
    for (const id of this.nodes.keys()) {
      inDegree.set(id, this.dependents.get(id)?.size || 0);
    }

    const queue: string[] = [];
    for (const [id, deg] of inDegree.entries()) {
      if (deg === 0) queue.push(id);
    }

    const order: string[] = [];
    while (queue.length) {
      const node = queue.shift()!;
      order.push(node);
      // For each node that this node depends on, reduce its in-degree
      for (const dep of this.dependencies.get(node) || []) {
        const newDeg = inDegree.get(dep)! - 1;
        inDegree.set(dep, newDeg);
        if (newDeg === 0) queue.push(dep);
      }
    }

    if (order.length !== this.nodes.size) {
      throw new Error('Cycle detected in dependency graph');
    }
    // Reverse to get dependencies first
    return order.reverse();
  }
}