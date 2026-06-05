// queries/grammar/Grammar.ts
import { ASTCommand } from '../parser';
import { Rules, ValidationResult } from './Rules';

export class Grammar {
  static validate(command: ASTCommand): ValidationResult {
    return Rules.validate(command);
  }

  static isComplete(command: ASTCommand): boolean {
    return command.target !== undefined && command.target !== '';
  }
}