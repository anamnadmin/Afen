import { ConfidenceEngine } from '../../engines/confidenceEngine';
import { RootCauseReport } from '../../core/rootCause';
import { ImpactReport } from '../../core/impact';

describe('ConfidenceEngine', () => {
  let engine: ConfidenceEngine;
  beforeEach(() => {
    engine = new ConfidenceEngine();
  });

  test('calculateConfidence from RootCauseReport', () => {
    const mockReport = new RootCauseReport('err1', [
      { nodeId: 'cause1', score: 0.9, confidence: 0.95, evidence: [] },
    ]);
    const score = engine.calculateConfidence(mockReport);
    expect(score.likelihood).toBe(0.95);
    expect(score.severity).toBe(1); // 1 candidate -> severity 1
    expect(score.overall).toBeGreaterThan(0);
  });

  test('calculateConfidence from ImpactReport', () => {
    const mockImpact = new ImpactReport({
      rootNode: 'err1',
      affectedNodes: ['a', 'b', 'c'],
      severity: 'high',
      totalImpactScore: 8,
    });
    const score = engine.calculateConfidence(mockImpact);
    expect(score.severity).toBe(8);
    expect(score.likelihood).toBe(0.8);
  });
});