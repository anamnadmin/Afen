// src/benchmarks/reasoningBenchmark.ts
import { performance } from 'perf_hooks';

class ReasoningEngine {
  async applyRules(facts: string[]): Promise<string[]> {
    await new Promise(r => setTimeout(r, 1));
    return facts.map(f => `derived_${f}`);
  }

  async buildChain(rootCause: string, depth: number): Promise<string[]> {
    const chain: string[] = [rootCause];
    for (let i = 1; i <= depth; i++) {
      chain.push(`intermediate_${i}`);
      await new Promise(r => setTimeout(r, 0.5));
    }
    return chain;
  }
}

interface ReasoningBenchmarkResult {
  depth: number;
  ruleEvalTimeMs: number;
  chainBuildTimeMs: number;
  correctnessScore: number;
}

export async function runReasoningBenchmark(): Promise<ReasoningBenchmarkResult[]> {
  const engine = new ReasoningEngine();
  const results: ReasoningBenchmarkResult[] = [];
  const depths = [3, 5, 10];

  for (const depth of depths) {
    const startRule = performance.now();
    const facts = Array.from({ length: 100 }, (_, i) => `fact${i}`);
    const derived = await engine.applyRules(facts);
    const ruleTime = performance.now() - startRule;

    const startChain = performance.now();
    await engine.buildChain('root', depth);
    const chainTime = performance.now() - startChain;

    const correctness = derived.length / facts.length;

    results.push({
      depth,
      ruleEvalTimeMs: parseFloat(ruleTime.toFixed(2)),
      chainBuildTimeMs: parseFloat(chainTime.toFixed(2)),
      correctnessScore: parseFloat(correctness.toFixed(3)),
    });
  }
  return results;
}