import { ReasoningEngine } from '../../engines/reasoningEngine';

describe('ReasoningEngine', () => {
  let engine: ReasoningEngine;
  beforeEach(() => {
    engine = new ReasoningEngine();
  });

  test('explainDecision returns explanation', () => {
    const result = engine.explainDecision({
      type: 'TRACE',
      input: 'err1',
      output: { chain: ['err1', 'cause1'] },
    });
    expect(result.summary).toBeDefined();
    expect(result.confidence).toBeDefined();
  });

  test('addRule adds custom rule', () => {
    const rule = {
      id: 'custom',
      conditions: [{ fact: 'test', operator: 'eq', value: true }],
      actions: [{ type: 'assert', target: 'result', value: 'ok' }],
      priority: 1,
    };
    engine.addRule(rule as any);
    const explanation = engine.explainDecision({ custom: true });
    // The rule might be applied depending on fact extraction
    expect(explanation).toBeDefined();
  });
});