// models/graph/Graph.ts
import { GraphNode } from './Node';
import { GraphEdge } from './Edge';

export class Graph {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: Map<string, GraphEdge> = new Map();

  addNode(node: GraphNode): this {
    this.nodes.set(node.id, node);
    return this;
  }

  removeNode(id: string): boolean {
    const removed = this.nodes.delete(id);
    // Remove all edges connected to this node
    for (const edge of this.edges.values()) {
      if (edge.source === id || edge.target === id) {
        this.edges.delete(edge.id);
      }
    }
    return removed;
  }

  addEdge(edge: GraphEdge): this {
    if (!this.nodes.has(edge.source) || !this.nodes.has(edge.target)) {
      throw new Error(`Cannot add edge: node ${edge.source} or ${edge.target} not found`);
    }
    this.edges.set(edge.id, edge);
    return this;
  }

  removeEdge(id: string): boolean {
    return this.edges.delete(id);
  }

  getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  getEdge(id: string): GraphEdge | undefined {
    return this.edges.get(id);
  }

  getAllNodes(): readonly GraphNode[] {
    return Array.from(this.nodes.values());
  }

  getAllEdges(): readonly GraphEdge[] {
    return Array.from(this.edges.values());
  }

  getOutgoingEdges(sourceId: string): GraphEdge[] {
    return Array.from(this.edges.values()).filter(e => e.source === sourceId);
  }

  getIncomingEdges(targetId: string): GraphEdge[] {
    return Array.from(this.edges.values()).filter(e => e.target === targetId);
  }

  clone(): Graph {
    const newGraph = new Graph();
    for (const node of this.nodes.values()) {
      newGraph.addNode(node);
    }
    for (const edge of this.edges.values()) {
      newGraph.addEdge(edge);
    }
    return newGraph;
  }

  clear(): void {
    this.nodes.clear();
    this.edges.clear();
  }
}