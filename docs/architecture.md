# Afen Architecture

## Layered Design

┌─────────────────────────────────────────────────────────────┐
│                     Benchmarks & Tests                       │
└─────────────────────────────────────────────────────────────┘
▲
┌─────────────────────────────────────────────────────────────┐
│                       Query Layer                            │
│                  (AQL: TRACE, CAUSE, EXPLAIN)                │
└─────────────────────────────────────────────────────────────┘
▲
┌─────────────────────────────────────────────────────────────┐
│                      Reasoning Engine                        │
│             (Deductive Logic + Bayesian Inference)           │
└─────────────────────────────────────────────────────────────┘
▲
┌─────────────────────────────────────────────────────────────┐
│                         Core                                 │
│                   (UIR + Graph Engine)                       │
└─────────────────────────────────────────────────────────────┘
▲
┌─────────────────────────────────────────────────────────────┐
│                         Models                               │
│             (ErrorNode, CauseEdge, Explanation)              │
└─────────────────────────────────────────────────────────────┘


## Models
Defines the core data structures used throughout the engine:
- `ErrorNode` – represents a single fault or error event.
- `CauseEdge` – directed relationship between two `ErrorNode` instances with a confidence weight.
- `Explanation` – structured output describing root cause and recommendations.

## Core

### UIR (Universal Intermediate Representation)
Transforms raw error logs into a normalized, structured format consumable by the Graph Engine. Acts as the translation layer between raw input and internal graph representation.

### Graph Engine
Constructs a directed causal graph from UIR output. Supports:
- **BFS** – breadth-first traversal for shortest causal path.
- **DFS** – depth-first traversal for full causal chain exploration.
- Node and edge indexing for O(1) lookups.

## Reasoning Engine
Two inference strategies operate on the causal graph:
- **Deductive (Logic-based)** – applies deterministic rules to identify confirmed root causes.
- **Probabilistic (Bayesian)** – computes confidence scores across causal paths using prior probabilities.

## Query Layer
Exposes the Afen Query Language (AQL) with three commands:
- `TRACE` – follows the causal chain from a given error to its root.
- `CAUSE` – lists direct causes with confidence scores.
- `EXPLAIN` – generates a human-readable explanation with recommendations.

## Interaction FlowRaw Error Logs
│
▼
UIR (normalize + structure)
│
▼
Graph Engine (build causal graph)
│
▼
Reasoning Engine (deductive + probabilistic inference)
│
▼
Query Layer (AQL: TRACE / CAUSE / EXPLAIN)
│
▼
Explanation Output