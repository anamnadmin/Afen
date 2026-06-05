// src/benchmarks/graphBenchmark.ts
import { performance } from 'perf_hooks';

interface GraphNode {
  id: string;
  data: any;
}

interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
}

class GraphEngine {
  nodes: Map<string, GraphNode> = new Map();
  edges: Map<string, GraphEdge[]> = new Map();

  addNode(node: GraphNode): void {
    this.nodes.set(node.id, node);
  }

  addEdge(edge: GraphEdge): void {
    if (!this.edges.has(edge.from)) this.edges.set(edge.from, []);
    this.edges.get(edge.from)!.push(edge);
  }

  bfs(startId: string): string[] {
    const visited = new Set<string>();
    const queue = [startId];
    const order: string[] = [];
    while (queue.length) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      order.push(id);
      const neighbors = this.edges.get(id) || [];
      for (const edge of neighbors) {
        if (!visited.has(edge.to)) queue.push(edge.to);
      }
    }
    return order;
  }

  dfs(startId: string): string[] {
    const visited = new Set<string>();
    const order: string[] = [];
    const dfsRec = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      order.push(id);
      const neighbors = this.edges.get(id) || [];
      for (const edge of neighbors) {
        dfsRec(edge.to);
      }
    };
    dfsRec(startId);
    return order;
  }
}

function generateGraph(nodeCount: number, edgeFactor = 2): { engine: GraphEngine } {
  const engine = new GraphEngine();
  for (let i = 0; i < nodeCount; i++) {
    const id = `n${i}`;
    engine.addNode({ id, data: { index: i } });
  }
  for (let i = 0; i < nodeCount; i++) {
    for (let j = 1; j <= edgeFactor; j++) {
      const toIdx = (i + j) % nodeCount;
      engine.addEdge({ from: `n${i}`, to: `n${toIdx}`, weight: 1 });
    }
  }
  return { engine };
}

interface GraphBenchmarkResult {
  nodes: number;
  edges: number;
  buildTimeMs: number;
  bfsTimeMs: number;
  dfsTimeMs: number;
  memoryMB: number;
}

export async function runGraphBenchmark(): Promise<GraphBenchmarkResult[]> {
  const results: GraphBenchmarkResult[] = [];
  const sizes = [100, 500, 1000];
  for (const size of sizes) {
    const memBefore = process.memoryUsage().heapUsed;
    const startBuild = performance.now();
    const { engine } = generateGraph(size);
    const buildTime = performance.now() - startBuild;
    const memAfter = process.memoryUsage().heapUsed;
    const memoryMB = (memAfter - memBefore) / (1024 * 1024);

    const startBfs = performance.now();
    engine.bfs('n0');
    const bfsTime = performance.now() - startBfs;

    const startDfs = performance.now();
    engine.dfs('n0');
    const dfsTime = performance.now() - startDfs;

    results.push({
      nodes: size,
      edges: size * 2,
      buildTimeMs: parseFloat(buildTime.toFixed(2)),
      bfsTimeMs: parseFloat(bfsTime.toFixed(2)),
      dfsTimeMs: parseFloat(dfsTime.toFixed(2)),
      memoryMB: parseFloat(memoryMB.toFixed(2)),
    });
  }
  return results;
}