// queries/parser/Tokenizer.ts
import { Token, TokenType, createToken } from './Token';

export class Tokenizer {
  private tokens: Token[] = [];
  private start = 0;
  private current = 0;
  private line = 1;
  private column = 1;

  constructor(private source: string) {}

  tokenize(): Token[] {
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
    this.column = 1;

    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(createToken(TokenType.EOF, '', this.line, this.column));
    return this.tokens;
  }

  private scanToken(): void {
    const c = this.advance();
    switch (c) {
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace
        break;
      case '\n':
        this.line++;
        this.column = 1;
        break;
      case '(':
      case ')':
      case ',':
        this.addToken(TokenType.SYMBOL, c);
        break;
      default:
        if (this.isAlpha(c)) {
          this.identifier();
        } else if (this.isDigit(c)) {
          this.number();
        } else if (c === "'" || c === '"') {
          this.string(c);
        } else {
          throw new Error(`Unexpected character '${c}' at ${this.line}:${this.column - 1}`);
        }
    }
  }

  private identifier(): void {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }
    const text = this.source.substring(this.start, this.current);
    const type = this.isKeyword(text) ? TokenType.KEYWORD : TokenType.IDENTIFIER;
    this.addToken(type, text);
  }

  private isKeyword(text: string): boolean {
    return ['TRACE', 'CAUSE', 'EXPLAIN', 'MAX_DEPTH', 'FORMAT'].includes(text);
  }

  private number(): void {
    while (this.isDigit(this.peek())) this.advance();
    this.addToken(TokenType.NUMBER, this.source.substring(this.start, this.current));
  }

  private string(quote: string): void {
    while (this.peek() !== quote && !this.isAtEnd()) {
      if (this.peek() === '\n') this.line++;
      this.advance();
    }
    if (this.isAtEnd()) throw new Error(`Unterminated string at ${this.line}:${this.column}`);
    this.advance(); // closing quote
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }

  private isAlpha(c: string): boolean {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
  }

  private isDigit(c: string): boolean {
    return c >= '0' && c <= '9';
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }

  private peek(): string {
    return this.isAtEnd() ? '\0' : this.source.charAt(this.current);
  }

  private advance(): string {
    const c = this.source.charAt(this.current);
    this.current++;
    this.column++;
    return c;
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private addToken(type: TokenType, value: string): void {
    this.tokens.push(createToken(type, value, this.line, this.column - value.length));
  }
}