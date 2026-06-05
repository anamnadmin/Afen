export class ScoreAggregator {
  /**
   * Combines multiple scores via weighted average.
   */
  aggregate(scores: { score: number; weight: number }[]): number {
    let totalWeight = 0;
    let weightedSum = 0;
    for (const { score, weight } of scores) {
      totalWeight += weight;
      weightedSum += score * weight;
    }
    if (totalWeight === 0) return 0;
    return weightedSum / totalWeight;
  }

  /**
   * Simple sum of scores.
   */
  sum(scores: number[]): number {
    return scores.reduce((a, b) => a + b, 0);
  }

  /**
   * Maximum score.
   */
  max(scores: number[]): number {
    return Math.max(...scores, 0);
  }
}