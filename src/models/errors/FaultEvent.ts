// models/errors/FaultEvent.ts
import { ErrorCode } from './ErrorCode';
import { ErrorSeverity } from './ErrorSeverity';

export interface FaultEventLocation {
  readonly file?: string;
  readonly line?: number;
  readonly column?: number;
  readonly nodeId?: string;
}

export class FaultEvent {
  constructor(
    public readonly code: ErrorCode,
    public readonly severity: ErrorSeverity,
    public readonly message: string,
    public readonly location?: FaultEventLocation,
    public readonly timestamp: number = Date.now(),
    public readonly metadata: Readonly<Record<string, unknown>> = {}
  ) {}

  toString(): string {
    return `[${this.severity.toUpperCase()}] ${ErrorCode[this.code]}: ${this.message}`;
  }

  toJSON(): object {
    return {
      code: this.code,
      severity: this.severity,
      message: this.message,
      location: this.location,
      timestamp: this.timestamp,
      metadata: this.metadata,
    };
  }
}