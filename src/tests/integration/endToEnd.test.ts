import { GraphStore } from '../../core/graph';
import { GraphEngine } from '../../engines/graphEngine';
import { RootCauseEngine } from '../../engines/rootCauseEngine';
import { ImpactEngine } from '../../engines/impactEngine';
import { ConfidenceEngine } from '../../engines/confidenceEngine';
import { ReasoningEngine } from '../../engines/reasoningEngine';
import { BuildInput } from '../../core/graph/GraphBuilder';

describe('End-to-End Pipeline', () => {
  let graphStore: GraphStore;
  let graphEngine: GraphEngine;
  let rootCauseEngine: RootCauseEngine;
  let impactEngine: ImpactEngine;
  let confidenceEngine: ConfidenceEngine;
  let reasoningEngine: ReasoningEngine;

  beforeEach(() => {
    graphStore = new GraphStore();
    graphEngine = new GraphEngine();
    rootCauseEngine = new RootCauseEngine(graphStore);
    impactEngine = new ImpactEngine(graphStore);
    confidenceEngine = new ConfidenceEngine();
    reasoningEngine = new ReasoningEngine();
  });

  test('Full flow: AST -> UIR -> Graph -> Engines -> Report', () => {
    // Simulate UIR input
    const input: BuildInput = {
      nodes: [
        { id: 'payment_service', type: 'service', label: 'Payment' },
        { id: 'timeout_error', type: 'error', label: 'Timeout' },
        { id: 'config_ttl', type: 'config', label: 'TTL' },
      ],
      edges: [
        { from: 'config_ttl', to: 'payment_service', type: 'depends_on' },
        { from: 'payment_service', to: 'timeout_error', type: 'causes' },
      ],
    };
    graphEngine.buildGraph(input);
    // Simulate fault event
    const faultEvent = { id: 'evt1', type: 'timeout', timestamp: Date.now(), nodeId: 'timeout_error', details: {} };
    const rootCauseReport = rootCauseEngine.findRootCause(faultEvent);
    const impactReport = impactEngine.analyzeImpactById('timeout_error');
    const confidence = confidenceEngine.calculateConfidence(rootCauseReport);
    const explanation = reasoningEngine.explainDecision({ type: 'EXPLAIN', input: 'timeout_error', output: rootCauseReport });

    expect(rootCauseReport.rankedCandidates.length).toBeGreaterThan(0);
    expect(impactReport.data.affectedNodes).toBeDefined();
    expect(confidence.overall).toBeGreaterThan(0);
    expect(explanation.summary).toBeDefined();
  });
});