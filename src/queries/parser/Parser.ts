import { Token, TokenType } from './Token';
import { Tokenizer } from './Tokenizer';

export interface ASTCommand {
  type: 'TRACE' | 'CAUSE' | 'EXPLAIN';
  target: string;
  options: Record<string, string | number>;
}

export class ParseError extends Error {
  constructor(message: string, public token: Token) {
    super(`${message} at ${token.line}:${token.column}`);
  }
}

export class Parser {
  private tokens: Token[] = [];
  private current = 0;

  parse(source: string): ASTCommand {
    const tokenizer = new Tokenizer(source);
    this.tokens = tokenizer.tokenize();
    this.current = 0;
    return this.parseCommand();
  }

  private parseCommand(): ASTCommand {
    const keywordToken = this.consume(TokenType.KEYWORD, 'Expected command (TRACE, CAUSE, EXPLAIN)');
    const command = keywordToken.value as 'TRACE' | 'CAUSE' | 'EXPLAIN';
    const target = this.consume(TokenType.IDENTIFIER, `Expected identifier after ${command}`).value;
    const options: Record<string, string | number> = {};

    while (this.peek().type !== TokenType.EOF) {
      const optName = this.consume(TokenType.KEYWORD, 'Expected option name').value;
      if (optName === 'MAX_DEPTH') {
        const numToken = this.consume(TokenType.NUMBER, 'Expected number after MAX_DEPTH');
        options[optName] = parseInt(numToken.value, 10);
      } else if (optName === 'FORMAT') {
        const strToken = this.consume(TokenType.STRING, 'Expected string after FORMAT');
        options[optName] = strToken.value;
      } else {
        throw new ParseError(`Unknown option '${optName}'`, this.peek());
      }
    }

    return { type: command, target, options };
  }

  private consume(type: TokenType, errorMessage: string, expectedValue?: string): Token {
    if (this.isAtEnd()) throw new ParseError(errorMessage, this.peek());
    const token = this.peek();
    if (token.type !== type) throw new ParseError(errorMessage, token);
    if (expectedValue !== undefined && token.value !== expectedValue) {
      throw new ParseError(`Expected '${expectedValue}', got '${token.value}'`, token);
    }
    this.advance();
    return token;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private advance(): void {
    if (!this.isAtEnd()) this.current++;
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }
}