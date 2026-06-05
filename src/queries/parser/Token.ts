// queries/parser/Token.ts
export enum TokenType {
  KEYWORD = 'KEYWORD',
  IDENTIFIER = 'IDENTIFIER',
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  SYMBOL = 'SYMBOL',
  EOF = 'EOF',
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export function createToken(type: TokenType, value: string, line: number, column: number): Token {
  return { type, value, line, column };
}