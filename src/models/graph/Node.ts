// models/graph/Node.ts
export interface GraphNodeMetadata {
  readonly label?: string;
  readonly type?: string;
  readonly tags?: readonly string[];
  readonly custom?: Record<string, unknown>;
}

export class GraphNode {
  constructor(
    public readonly id: string,
    public readonly metadata: GraphNodeMetadata = {}
  ) {}

  withMetadata(updates: Partial<GraphNodeMetadata>): GraphNode {
    return new GraphNode(this.id, { ...this.metadata, ...updates });
  }
}