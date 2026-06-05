export interface Candidate {
  nodeId: string;
  score: number;
  confidence: number;
  evidence: string[];
}

export class CandidateRanker {
  /**
   * Ranks candidates based on a score and optional tie-breaking.
   */
  rank(candidates: Candidate[]): Candidate[] {
    return candidates.sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return b.confidence - a.confidence;
    });
  }
}