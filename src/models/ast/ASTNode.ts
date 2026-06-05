// models/ast/ASTNode.ts
/**
 * Base interface for all AST nodes.
 */
export interface ASTNode {
  /** Unique identifier for the node */
  readonly id: string;
  /** Type of the node (e.g., 'Literal', 'BinaryExpression', 'FunctionCall') */
  readonly type: string;
  /** Child nodes (may be empty) */
  readonly children: readonly ASTNode[];
  /** Source location information (optional) */
  readonly location?: ASTLocation;
}

export interface ASTLocation {
  readonly file: string;
  readonly line: number;
  readonly column: number;
}