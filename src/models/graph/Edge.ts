// models/graph/Edge.ts
export type EdgeType = 'causes' | 'depends_on' | 'triggers' | 'related_to';

export interface GraphEdgeMetadata {
  readonly weight?: number;
  readonly confidence?: number;
  readonly tags?: readonly string[];
  readonly custom?: Record<string, unknown>;
}

export class GraphEdge {
  constructor(
    public readonly source: string,
    public readonly target: string,
    public readonly type: EdgeType = 'related_to',
    public readonly metadata: GraphEdgeMetadata = {}
  ) {}

  get id(): string {
    return `${this.source}->${this.target}:${this.type}`;
  }

  withMetadata(updates: Partial<GraphEdgeMetadata>): GraphEdge {
    return new GraphEdge(this.source, this.target, this.type, { ...this.metadata, ...updates });
  }
}