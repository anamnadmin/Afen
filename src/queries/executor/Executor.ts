// src/queries/executor/Executor.ts
import { ASTCommand } from '../parser';
import { QueryPlan } from './QueryPlan';
import { QueryResult } from './QueryResult';
import { Grammar } from '../grammar';

// Engine imports
import { GraphEngine } from '../../engines/graphEngine';
import { RootCauseEngine, FaultEvent } from '../../engines/rootCauseEngine';
import { ImpactEngine } from '../../engines/impactEngine';
import { ConfidenceEngine } from '../../engines/confidenceEngine';
import { ReasoningEngine } from '../../engines/reasoningEngine';
import { GraphStore } from '../../core/graph';

export class Executor {
  private graphEngine: GraphEngine;
  private rootCauseEngine: RootCauseEngine;
  private impactEngine: ImpactEngine;
  private confidenceEngine: ConfidenceEngine;
  private reasoningEngine: ReasoningEngine;

  constructor(graphStore: GraphStore) {
    this.graphEngine = new GraphEngine();
    this.rootCauseEngine = new RootCauseEngine(graphStore);
    this.impactEngine = new ImpactEngine(graphStore);
    this.confidenceEngine = new ConfidenceEngine();
    this.reasoningEngine = new ReasoningEngine();
  }

  async execute(command: ASTCommand): Promise<QueryResult> {
    const startTime = Date.now();
    const validation = Grammar.validate(command);
    if (!validation.valid) {
      return QueryResult.failure(`Validation failed: ${validation.errors.join(', ')}`);
    }

    try {
      let plan: QueryPlan;
      switch (command.type) {
        case 'TRACE':
          plan = QueryPlan.forTraceCommand(command.target, (command.options.MAX_DEPTH as number) || 10);
          break;
        case 'CAUSE':
          plan = QueryPlan.forCauseCommand(command.target);
          break;
        case 'EXPLAIN':
          plan = QueryPlan.forExplainCommand(command.target, (command.options.FORMAT as string) || 'text');
          break;
        default:
          return QueryResult.failure(`Unknown command type: ${command.type}`);
      }

      const stepResults: Record<string, any> = {};
      for (const step of plan.steps) {
        const result = await this.executeStep(step, command, stepResults);
        stepResults[`${step.engine}_${step.method}`] = result;
      }

      const finalOutput = this.aggregateOutput(command.type, stepResults);
      const explanation = stepResults['reasoning_explainDecision']?.summary || 'No explanation generated.';
      const elapsed = Date.now() - startTime;

      return QueryResult.success(command.type, command.target, finalOutput, explanation, elapsed);
    } catch (err: any) {
      return QueryResult.failure(err.message || String(err));
    }
  }

  private async executeStep(
    step: QueryPlan['steps'][0],
    originalCommand: ASTCommand,
    stepResults: Record<string, any>
  ): Promise<any> {
    switch (step.engine) {
      case 'graph':
        if (step.method === 'traverseGraph') {
          const { startId, direction, method, maxDepth } = step.parameters;
          const result = this.graphEngine.traverseGraph(startId as string, direction as any, method as any);
          return result.slice(0, maxDepth as number);
        }
        break;
      case 'rootCause':
        if (step.method === 'findRootCause') {
          const faultEvent: FaultEvent = {
            id: `query-${Date.now()}`,
            type: 'query',
            timestamp: Date.now(),
            nodeId: (step.parameters.event as any).nodeId,
            details: {},
          };
          const report = this.rootCauseEngine.findRootCause(faultEvent);
          return report;
        }
        break;
      case 'impact':
        if (step.method === 'analyzeImpactById') {
          return this.impactEngine.analyzeImpactById(step.parameters.nodeId as string);
        }
        break;
      case 'confidence':
        if (step.method === 'calculateConfidence') {
          const rootCauseResult = stepResults['rootCause_findRootCause'];
          if (rootCauseResult) {
            return this.confidenceEngine.calculateConfidence(rootCauseResult);
          }
          return { overall: 0.5, likelihood: 0.5, severity: 0, details: {} };
        }
        break;
      case 'reasoning':
        if (step.method === 'explainDecision') {
          return this.reasoningEngine.explainDecision({
            type: originalCommand.type,
            input: originalCommand.target,
            output: step.parameters,
          });
        }
        break;
    }
    throw new Error(`Unsupported step: ${step.engine}.${step.method}`);
  }

  private aggregateOutput(commandType: string, stepResults: Record<string, any>): any {
    if (commandType === 'TRACE') {
      return { chain: stepResults['graph_traverseGraph'] || [] };
    } else if (commandType === 'CAUSE') {
      const rootCauseReport = stepResults['rootCause_findRootCause'];
      return { candidates: rootCauseReport?.rankedCandidates || [] };
    } else {
      const rootCauseReport = stepResults['rootCause_findRootCause'];
      const impactReport = stepResults['impact_analyzeImpactById'];
      return { rootCause: rootCauseReport?.getTopCandidate(), impact: impactReport?.data };
    }
  }
}