// models/uir/UIREvent.ts
import { RuntimeEvent } from '../runtime/RuntimeEvent';
import { ASTNode } from '../ast/ASTNode';
import { UIRContext } from './UIRContext';

export type UIREventType = 
  | 'error_occurred'
  | 'state_change'
  | 'graph_node_created'
  | 'graph_edge_created'
  | 'inference_made';

export class UIREvent {
  constructor(
    public readonly id: string,
    public readonly type: UIREventType,
    public readonly timestamp: number,
    public readonly sourceEvent?: RuntimeEvent,
    public readonly astNode?: ASTNode,
    public readonly context?: UIRContext,
    public readonly payload: Record<string, unknown> = {}
  ) {}

  toJSON(): object {
    return {
      id: this.id,
      type: this.type,
      timestamp: this.timestamp,
      payload: this.payload,
      hasSourceEvent: !!this.sourceEvent,
      hasAstNode: !!this.astNode,
    };
  }
}