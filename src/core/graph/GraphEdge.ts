export interface GraphEdgeData {
  from: string;
  to: string;
  type: string; // e.g., 'causes', 'depends_on', 'triggers'
  weight?: number;
  metadata?: Record<string, any>;
}

export class GraphEdge {
  constructor(public readonly id: string, public data: GraphEdgeData) {}
}