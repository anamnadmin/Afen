import { GraphStore } from './GraphStore';

export class GraphTraversal {
  constructor(private store: GraphStore) {}

  /**
   * Breadth‑first search from start node.
   * @param startId Start node ID.
   * @param direction 'forward' (outgoing) or 'backward' (incoming).
   */
  bfs(startId: string, direction: 'forward' | 'backward' = 'forward'): string[] {
    const visited = new Set<string>();
    const queue = [startId];
    const order: string[] = [];
    while (queue.length) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      order.push(id);
      const edges = direction === 'forward' ? this.store.getOutgoingEdges(id) : this.store.getIncomingEdges(id);
      for (const edge of edges) {
        const nextId = direction === 'forward' ? edge.data.to : edge.data.from;
        if (!visited.has(nextId)) queue.push(nextId);
      }
    }
    return order;
  }

  /**
   * Depth‑first search (recursive).
   */
  dfs(startId: string, direction: 'forward' | 'backward' = 'forward'): string[] {
    const visited = new Set<string>();
    const order: string[] = [];
    const dfsRec = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      order.push(id);
      const edges = direction === 'forward' ? this.store.getOutgoingEdges(id) : this.store.getIncomingEdges(id);
      for (const edge of edges) {
        const nextId = direction === 'forward' ? edge.data.to : edge.data.from;
        dfsRec(nextId);
      }
    };
    dfsRec(startId);
    return order;
  }

  /**
   * Finds all paths between two nodes (simple paths, no cycles).
   */
  findAllPaths(fromId: string, toId: string, maxDepth = 10): string[][] {
    const paths: string[][] = [];
    const visited = new Set<string>();
    const dfsPath = (current: string, path: string[]) => {
      if (path.length > maxDepth) return;
      if (current === toId) {
        paths.push([...path, current]);
        return;
      }
      visited.add(current);
      for (const edge of this.store.getOutgoingEdges(current)) {
        const next = edge.data.to;
        if (!visited.has(next)) {
          dfsPath(next, [...path, current]);
        }
      }
      visited.delete(current);
    };
    dfsPath(fromId, []);
    return paths;
  }
}