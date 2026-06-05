// queries/executor/QueryPlan.ts
export interface QueryStep {
  order: number;
  engine: 'graph' | 'rootCause' | 'impact' | 'confidence' | 'reasoning';
  method: string;
  parameters: Record<string, unknown>;
}

export class QueryPlan {
  constructor(public readonly steps: QueryStep[]) {}

  static forTraceCommand(targetId: string, maxDepth: number = 10): QueryPlan {
    return new QueryPlan([
      { order: 1, engine: 'graph', method: 'traverseGraph', parameters: { startId: targetId, direction: 'backward', method: 'bfs', maxDepth } },
      { order: 2, engine: 'reasoning', method: 'explainDecision', parameters: { decisionType: 'trace', data: { targetId, maxDepth } } }
    ]);
  }

  static forCauseCommand(targetId: string): QueryPlan {
    return new QueryPlan([
      { order: 1, engine: 'rootCause', method: 'findRootCause', parameters: { event: { nodeId: targetId } } },
      { order: 2, engine: 'confidence', method: 'calculateConfidence', parameters: { fromRootCause: true } }
    ]);
  }

  static forExplainCommand(targetId: string, format: string = 'text'): QueryPlan {
    return new QueryPlan([
      { order: 1, engine: 'rootCause', method: 'findRootCause', parameters: { event: { nodeId: targetId } } },
      { order: 2, engine: 'impact', method: 'analyzeImpactById', parameters: { nodeId: targetId } },
      { order: 3, engine: 'reasoning', method: 'explainDecision', parameters: { decisionType: 'explain', format, targetId } }
    ]);
  }
}