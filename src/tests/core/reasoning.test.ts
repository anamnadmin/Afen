import { ReasoningRule, ReasoningEngine, ReasoningChain } from '../../core/reasoning';

describe('ReasoningRule', () => {
  test('evaluates condition correctly', () => {
    const rule = new ReasoningRule(
      'test',
      [{ fact: 'x', operator: 'eq', value: 5 }],
      [{ type: 'assert', target: 'y', value: 10 }]
    );
    const facts = new Map([['x', 5]]);
    expect(rule.evaluate(facts)).toBe(true);
    facts.set('x', 3);
    expect(rule.evaluate(facts)).toBe(false);
  });
});

describe('ReasoningEngine', () => {
  test('forward chaining asserts new facts', () => {
    const rule = new ReasoningRule(
      'r1',
      [{ fact: 'a', operator: 'eq', value: 1 }],
      [{ type: 'assert', target: 'b', value: 2 }]
    );
    const engine = new ReasoningEngine();
    const { facts, chain } = engine.run({
      facts: new Map([['a', 1]]),
      rules: [rule],
    });
    expect(facts.get('b')).toBe(2);
    expect(chain.getSteps()).toHaveLength(1);
  });
});

describe('ReasoningChain', () => {
  test('stores steps', () => {
    const chain = new ReasoningChain();
    const rule = new ReasoningRule('r', [], []);
    chain.addStep(rule, ['fact1'], ['action1']);
    expect(chain.getSteps()).toHaveLength(1);
    expect(chain.getSteps()[0].ruleId).toBe('r');
  });
});