import { GraphNode } from '../core/graph/GraphNode';
import { GraphStore } from '../core/graph';
import { ImpactAnalyzer, ImpactReport, BlastRadius } from '../core/impact';

/**
 * Engine for impact analysis.
 */
export class ImpactEngine {
  private analyzer: ImpactAnalyzer;

  constructor(graphStore: GraphStore) {
    const blastRadius = new BlastRadius(graphStore);
    // ImpactAnalyzer now expects only BlastRadius (store removed from constructor)
    this.analyzer = new ImpactAnalyzer(blastRadius);
  }

  /**
   * Analyzes the potential impact of a failed node.
   * @param node The node that has failed.
   * @returns ImpactReport containing affected nodes and severity.
   */
  analyzeImpact(node: GraphNode): ImpactReport {
    return this.analyzer.analyze({ failedNodeId: node.id });
  }

  /**
   * Convenience method using node ID.
   */
  analyzeImpactById(nodeId: string): ImpactReport {
    return this.analyzer.analyze({ failedNodeId: nodeId });
  }
}