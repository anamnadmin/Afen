export interface ReasoningRuleCondition {
  fact: string;
  operator: 'eq' | 'gt' | 'lt' | 'contains';
  value: any;
}

export interface ReasoningRuleAction {
  type: 'assert' | 'retract' | 'score';
  target: string;
  value?: any;
}

export class ReasoningRule {
  constructor(
    public readonly id: string,
    public readonly conditions: ReasoningRuleCondition[],
    public readonly actions: ReasoningRuleAction[],
    public readonly priority: number = 0
  ) {}

  evaluate(facts: Map<string, any>): boolean {
    return this.conditions.every(cond => {
      const factValue = facts.get(cond.fact);
      if (factValue === undefined) return false;
      switch (cond.operator) {
        case 'eq': return factValue === cond.value;
        case 'gt': return factValue > cond.value;
        case 'lt': return factValue < cond.value;
        case 'contains': return String(factValue).includes(String(cond.value));
        default: return false;
      }
    });
  }
}