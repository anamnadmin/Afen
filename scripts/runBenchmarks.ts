import { runGraphBenchmark } from '../src/benchmarks/graphBenchmark';
import { runQueryBenchmark } from '../src/benchmarks/queryBenchmark';
import { runReasoningBenchmark } from '../src/benchmarks/reasoningBenchmark';

async function runBenchmarks() {
  console.log('=== Afen Benchmarks ===\n');

  console.log('📊 Graph Build Benchmark');
  const graphResults = await runGraphBenchmark();
  console.table(graphResults);
  console.log('');

  console.log('⚡ Query Execution Benchmark');
  const queryResults = await runQueryBenchmark();
  const avgLatency = queryResults.length > 0 ? queryResults[0].avgLatencyMs : 0;
  console.log(`   Average latency: ${avgLatency.toFixed(2)}ms`);
  console.table(queryResults);
  console.log('');

  console.log('🎯 Reasoning Accuracy Benchmark');
  const reasoningResults = await runReasoningBenchmark();
  const first = reasoningResults[0];
  console.log(`   Correctness: ${first?.correctnessScore ?? 0}, Depth: ${first?.depth ?? 0}`);
  console.table(reasoningResults);
  console.log('');

  console.log('✅ Benchmark suite completed.');
}

runBenchmarks().catch(err => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});