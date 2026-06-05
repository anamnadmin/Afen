// queries/grammar/Rules.ts
import { ASTCommand } from '../parser';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class Rules {
  static validate(command: ASTCommand): ValidationResult {
    const errors: string[] = [];
    if (!command.target || command.target.trim() === '') {
      errors.push('Target identifier cannot be empty');
    }
    if (command.type === 'TRACE') {
      const depth = command.options.MAX_DEPTH;
      if (depth !== undefined && (typeof depth !== 'number' || depth < 1 || depth > 100)) {
        errors.push('MAX_DEPTH must be a number between 1 and 100');
      }
    }
    if (command.type === 'EXPLAIN') {
      const format = command.options.FORMAT;
      if (format !== undefined && format !== 'text' && format !== 'json') {
        errors.push('FORMAT must be "text" or "json"');
      }
    }
    return { valid: errors.length === 0, errors };
  }
}