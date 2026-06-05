import { ReasoningRule } from './ReasoningRule';

export interface ChainStep {
  ruleId: string;
  factsUsed: string[];
  actionsTaken: string[];
}

export class ReasoningChain {
  private steps: ChainStep[] = [];

  addStep(rule: ReasoningRule, factsUsed: string[], actionsTaken: string[]): void {
    this.steps.push({ ruleId: rule.id, factsUsed, actionsTaken });
  }

  getSteps(): ChainStep[] {
    return [...this.steps];
  }

  toJSON() {
    return { steps: this.steps };
  }
}