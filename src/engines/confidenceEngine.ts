// src/engines/confidenceEngine.ts
import { LikelihoodScore, SeverityScore, Scorer } from '../core/scoring';
import { RootCauseReport } from '../core/rootCause';
import { ImpactReport } from '../core/impact';

export interface ConfidenceScore {
  overall: number;
  likelihood: number;
  severity: number;
  details: Record<string, any>;
}

export class ConfidenceEngine {
  private scorer: Scorer;

  constructor() {
    this.scorer = new Scorer();
  }

  calculateConfidence(report: RootCauseReport | ImpactReport): ConfidenceScore {
    if (this.isRootCauseReport(report)) {
      return this.calculateFromRootCauseReport(report);
    } else {
      return this.calculateFromImpactReport(report);
    }
  }

  private calculateFromRootCauseReport(report: RootCauseReport): ConfidenceScore {
    const topCandidate = report.getTopCandidate();
    const likelihoodValue = topCandidate?.confidence ?? 0.5;
    const severityValue = Math.min(10, report.rankedCandidates.length);
    const likelihood = new LikelihoodScore(likelihoodValue);
    const severity = new SeverityScore(severityValue);
    const overall = this.scorer.computeRiskScore(likelihood, severity);
    return {
      overall,
      likelihood: likelihoodValue,
      severity: severityValue,
      details: { candidateCount: report.rankedCandidates.length, topCandidateId: topCandidate?.nodeId },
    };
  }

  private calculateFromImpactReport(report: ImpactReport): ConfidenceScore {
    const severityValue = this.mapSeverityToNumber(report.data.severity);
    const likelihood = new LikelihoodScore(0.8);
    const severity = new SeverityScore(severityValue);
    const overall = this.scorer.computeRiskScore(likelihood, severity);
    return {
      overall,
      likelihood: 0.8,
      severity: severityValue,
      details: { affectedNodes: report.data.affectedNodes.length, severityLabel: report.data.severity },
    };
  }

  private mapSeverityToNumber(severity: 'low' | 'medium' | 'high' | 'critical'): number {
    switch (severity) {
      case 'low': return 2;
      case 'medium': return 5;
      case 'high': return 8;
      case 'critical': return 10;
      default: return 5;
    }
  }

  private isRootCauseReport(report: RootCauseReport | ImpactReport): report is RootCauseReport {
    return (report as RootCauseReport).rankedCandidates !== undefined;
  }
}