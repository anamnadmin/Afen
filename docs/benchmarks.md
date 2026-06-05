# Afen Benchmarks

## Goals

| Dimension    | Metric                                      |
|--------------|---------------------------------------------|
| Performance  | Graph build time, query latency (p50/p95/p99) |
| Accuracy     | Precision, Recall, F1 for root cause detection |
| Scalability  | Memory usage and time vs. graph size        |

## Running

```bash
npm run bench
```

## Benchmark Suites

### 1. Graph Build
Measures causal graph construction time across increasing node counts.

| Nodes | Expected Time |
|-------|---------------|
| 100   | ~12ms         |
| 500   | ~55ms         |
| 1000  | ~110ms        |
| 5000  | ~600ms        |

### 2. Query Execution
Measures latency for each AQL command at 1000 nodes.

| Command   | Expected Latency |
|-----------|-----------------|
| `TRACE`   | < 10ms          |
| `CAUSE`   | < 5ms           |
| `EXPLAIN` | < 20ms          |

### 3. Reasoning Accuracy
Evaluates inference quality against a ground-truth dataset.

| Strategy      | Expected F1 |
|---------------|-------------|
| Deductive     | ≥ 0.90      |
| Probabilistic | ≥ 0.85      |

## Output Example

```
=== Afen Benchmarks ===

📊 Running Graph Build Benchmark...
   Graph built in 108.43ms

⚡ Running Query Execution Benchmark...
   Average query latency: 4.20ms

🎯 Running Reasoning Accuracy Benchmark...
   Precision: 0.92, Recall: 0.89, F1: 0.905

=== Summary ===
✅ Graph Build
✅ Query Execution
✅ Reasoning Accuracy
```