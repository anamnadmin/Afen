import { LikelihoodScore, SeverityScore, Scorer, ScoreAggregator } from '../../core/scoring';

describe('LikelihoodScore', () => {
  test('clamps value between 0 and 1', () => {
    expect(new LikelihoodScore(0.5).value).toBe(0.5);
    expect(() => new LikelihoodScore(1.2)).toThrow();
  });
});

describe('SeverityScore', () => {
  test('clamps value between 0 and 10', () => {
    expect(new SeverityScore(5).value).toBe(5);
    expect(() => new SeverityScore(11)).toThrow();
  });
});

describe('Scorer', () => {
  test('computeRiskScore combines likelihood and severity', () => {
    const scorer = new Scorer();
    const likelihood = new LikelihoodScore(0.8);
    const severity = new SeverityScore(8);
    const risk = scorer.computeRiskScore(likelihood, severity);
    expect(risk).toBe(0.64);
  });
});

describe('ScoreAggregator', () => {
  test('aggregate weighted average', () => {
    const aggregator = new ScoreAggregator();
    const result = aggregator.aggregate([
      { score: 0.8, weight: 1 },
      { score: 0.6, weight: 2 },
    ]);
    expect(result).toBe((0.8 * 1 + 0.6 * 2) / 3);
  });
});