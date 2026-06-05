import { Candidate } from './CandidateRanker';

export class RootCauseReport {
  constructor(
    public readonly errorNodeId: string,
    public readonly rankedCandidates: Candidate[]
  ) {}

  getTopCandidate(): Candidate | undefined {
    return this.rankedCandidates[0];
  }

  toJSON() {
    return {
      errorNodeId: this.errorNodeId,
      candidates: this.rankedCandidates,
    };
  }
}