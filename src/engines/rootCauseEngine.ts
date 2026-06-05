import { GraphStore } from '../core/graph';
import { RootCauseAnalyzer, RootCauseReport, RootCauseAnalysisInput } from '../core/rootCause';

export interface FaultEvent {
  id: string;
  type: string;
  timestamp: number;
  nodeId: string;
  details: Record<string, any>;
}

export class RootCauseEngine {
  private analyzer: RootCauseAnalyzer;

  constructor(graphStore: GraphStore) {
    this.analyzer = new RootCauseAnalyzer(graphStore);
  }

  findRootCause(event: FaultEvent): RootCauseReport {
    const input: RootCauseAnalysisInput = {
      errorNodeId: event.nodeId,
      maxDepth: 10,
      minConfidence: 0.0,
    };
    return this.analyzer.analyze(input);
  }
}