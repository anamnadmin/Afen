import { ReasoningRule } from './ReasoningRule';
import { ReasoningChain } from './ReasoningChain';

export interface ReasoningContext {
  facts: Map<string, any>;
  rules: ReasoningRule[];
  maxIterations?: number;
}

export class ReasoningEngine {
  /**
   * Runs forward chaining inference.
   * @returns Final fact set and reasoning chain.
   */
  run(context: ReasoningContext): { facts: Map<string, any>; chain: ReasoningChain } {
    const facts = new Map(context.facts);
    const rules = [...context.rules].sort((a, b) => b.priority - a.priority);
    const chain = new ReasoningChain();
    let changed = true;
    let iterations = 0;
    const maxIt = context.maxIterations || 100;

    while (changed && iterations < maxIt) {
      changed = false;
      for (const rule of rules) {
        if (rule.evaluate(facts)) {
          const usedFacts = rule.conditions.map(c => c.fact);
          const actionsTaken: string[] = [];
          for (const action of rule.actions) {
            if (action.type === 'assert') {
              if (!facts.has(action.target)) {
                facts.set(action.target, action.value ?? true);
                actionsTaken.push(`assert ${action.target}=${action.value}`);
                changed = true;
              }
            } else if (action.type === 'retract') {
              if (facts.delete(action.target)) {
                actionsTaken.push(`retract ${action.target}`);
                changed = true;
              }
            } else if (action.type === 'score') {
              // scoring handled elsewhere
              actionsTaken.push(`score ${action.target} += ${action.value}`);
            }
          }
          if (actionsTaken.length > 0) {
            chain.addStep(rule, usedFacts, actionsTaken);
          }
        }
      }
      iterations++;
    }
    return { facts, chain };
  }
}