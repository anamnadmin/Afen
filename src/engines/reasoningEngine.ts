import {
  ReasoningRule,
  ReasoningChain,
  ReasoningEngine as CoreReasoningEngine,
  ReasoningContext,
} from '../core/reasoning';

export interface QueryResult {
  type: 'TRACE' | 'CAUSE' | 'EXPLAIN';
  input: string;
  output: any;
}

export interface Explanation {
  summary: string;
  chain: ReasoningChain;
  factsUsed: Map<string, any>;
  confidence: number;
}

/**
 * Engine that provides explainability for decisions made by other engines.
 */
export class ReasoningEngine {
  private coreEngine: CoreReasoningEngine;
  private rules: ReasoningRule[] = [];

  constructor() {
    this.coreEngine = new CoreReasoningEngine();
    this.initializeDefaultRules();
  }

  private initializeDefaultRules(): void {
    // Example rule: if a node has high severity, increase confidence.
    this.addRule(new ReasoningRule(
      'high_severity_boost',
      [{ fact: 'severity', operator: 'gt', value: 7 }],
      [{ type: 'score', target: 'confidence', value: 0.2 }],
      10
    ));
    // Rule: if root cause depth is low, it's more likely.
    this.addRule(new ReasoningRule(
      'shallow_depth_likely',
      [{ fact: 'depth', operator: 'lt', value: 3 }],
      [{ type: 'assert', target: 'likely_root', value: true }],
      5
    ));
  }

  addRule(rule: ReasoningRule | any): void {
    if (rule instanceof ReasoningRule) {
      this.rules.push(rule);
    } else {
      // Wrap plain object into ReasoningRule
      this.rules.push(new ReasoningRule(rule.id, rule.conditions, rule.actions, rule.priority));
    }
  }

  /**
   * Explains a decision made by a query or engine.
   * @param input QueryResult or any object with relevant facts.
   * @returns Explanation containing reasoning chain and final confidence.
   */
  explainDecision(input: QueryResult | Record<string, any>): Explanation {
    // Build initial facts from input
    const facts = new Map<string, any>();
    if ('type' in input) {
      facts.set('query_type', input.type);
      facts.set('query_input', input.input);
      if (input.output) {
        if (input.output.chain) facts.set('trace_chain', input.output.chain);
        if (input.output.causes) facts.set('cause_list', input.output.causes);
      }
    } else {
      // Plain object, extract keys
      Object.entries(input).forEach(([k, v]) => facts.set(k, v));
    }

    const context: ReasoningContext = {
      facts,
      rules: this.rules,
      maxIterations: 20,
    };

    const { facts: finalFacts, chain } = this.coreEngine.run(context);
    const confidence = finalFacts.get('confidence') ?? 0.7;
    const summary = this.generateSummary(chain, finalFacts);

    return {
      summary,
      chain,
      factsUsed: finalFacts,
      confidence: typeof confidence === 'number' ? confidence : 0.7,
    };
  }

  private generateSummary(chain: ReasoningChain, facts: Map<string, any>): string {
    const steps = chain.getSteps();
    if (steps.length === 0) return 'No reasoning steps were applied.';
    const lastAction = steps[steps.length - 1].actionsTaken[0] || 'no action';
    return `Reasoning applied ${steps.length} rule(s). ${lastAction}. Final confidence: ${facts.get('confidence') ?? 0.7}`;
  }
}