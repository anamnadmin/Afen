import { Tokenizer, Parser } from '../../queries/parser';

describe('Tokenizer', () => {
  test('tokenizes simple TRACE command', () => {
    const tokenizer = new Tokenizer('TRACE err123');
    const tokens = tokenizer.tokenize();
    expect(tokens[0].type).toBe('KEYWORD');
    expect(tokens[0].value).toBe('TRACE');
    expect(tokens[1].type).toBe('IDENTIFIER');
    expect(tokens[1].value).toBe('err123');
  });

  test('tokenizes with options', () => {
    const tokenizer = new Tokenizer('EXPLAIN err1 FORMAT "json"');
    const tokens = tokenizer.tokenize();
    const values = tokens.map(t => t.value);
    expect(values).toContain('EXPLAIN');
    expect(values).toContain('FORMAT');
    expect(values).toContain('json');
  });
});

describe('Parser', () => {
  let parser: Parser;
  beforeEach(() => {
    parser = new Parser();
  });

  test('parses valid TRACE command', () => {
    const ast = parser.parse('TRACE my_error MAX_DEPTH 10');
    expect(ast.type).toBe('TRACE');
    expect(ast.target).toBe('my_error');
    expect(ast.options.MAX_DEPTH).toBe(10);
  });

  test('parses valid CAUSE command', () => {
    const ast = parser.parse('CAUSE error_42');
    expect(ast.type).toBe('CAUSE');
    expect(ast.target).toBe('error_42');
  });

  test('throws on missing target', () => {
    expect(() => parser.parse('TRACE')).toThrow();
  });
});