import { GraphStore } from '../graph/GraphStore';
import { GraphTraversal } from '../graph/GraphTraversal';
import { Candidate, CandidateRanker } from './CandidateRanker';
import { RootCauseReport } from './RootCauseReport';

export interface RootCauseAnalysisInput {
  errorNodeId: string;
  maxDepth?: number;
  minConfidence?: number;
}

export class RootCauseAnalyzer {
  private traversal: GraphTraversal;
  private ranker: CandidateRanker;
  constructor(private store: GraphStore) {
    this.traversal = new GraphTraversal(store);
    this.ranker = new CandidateRanker();
  }

  analyze(input: RootCauseAnalysisInput): RootCauseReport {
    const { errorNodeId, maxDepth = 10, minConfidence = 0.0 } = input;
    // Backward BFS to find potential root causes
    const backwardNodes = this.traversal.bfs(errorNodeId, 'backward');
    const candidates: Candidate[] = [];
    for (const nodeId of backwardNodes) {
      if (nodeId === errorNodeId) continue;
      const depth = this.getDepth(errorNodeId, nodeId);
      if (depth > maxDepth) continue;
      const confidence = this.calculateConfidence(nodeId, depth);
      if (confidence < minConfidence) continue;
      candidates.push({
        nodeId,
        score: confidence * (1 - depth / maxDepth),
        confidence,
        evidence: [`causal path length ${depth}`],
      });
    }
    // If no candidates found, add a fallback with low confidence
    if (candidates.length === 0) {
      candidates.push({
        nodeId: errorNodeId,
        score: 0.1,
        confidence: 0.1,
        evidence: ['no direct causes found; root cause may be the error itself'],
      });
    }
    const ranked = this.ranker.rank(candidates);
    return new RootCauseReport(errorNodeId, ranked);
  }

  private getDepth(fromId: string, toId: string): number {
    const visited = new Map<string, number>();
    const queue = [{ id: fromId, dist: 0 }];
    while (queue.length) {
      const { id, dist } = queue.shift()!;
      if (id === toId) return dist;
      if (visited.has(id)) continue;
      visited.set(id, dist);
      for (const edge of this.store.getIncomingEdges(id)) {
        const prev = edge.data.from;
        if (!visited.has(prev)) {
          queue.push({ id: prev, dist: dist + 1 });
        }
      }
    }
    return Infinity;
  }

  private calculateConfidence(_nodeId: string, depth: number): number {
    return Math.exp(-depth / 3);
  }
}