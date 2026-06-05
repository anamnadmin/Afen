import { Grammar } from '../../queries/grammar';

describe('Grammar', () => {
  test('validates correct TRACE command', () => {
    const command = { type: 'TRACE', target: 'err1', options: { MAX_DEPTH: 5 } };
    const result = Grammar.validate(command as any);
    expect(result.valid).toBe(true);
  });

  test('invalid TRACE with bad MAX_DEPTH', () => {
    const command = { type: 'TRACE', target: 'err1', options: { MAX_DEPTH: 200 } };
    const result = Grammar.validate(command as any);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('between 1 and 100');
  });

  test('validates EXPLAIN with correct format', () => {
    const command = { type: 'EXPLAIN', target: 'err1', options: { FORMAT: 'json' } };
    const result = Grammar.validate(command as any);
    expect(result.valid).toBe(true);
  });

  test('rejects EXPLAIN with invalid format', () => {
    const command = { type: 'EXPLAIN', target: 'err1', options: { FORMAT: 'xml' } };
    const result = Grammar.validate(command as any);
    expect(result.valid).toBe(false);
  });
});