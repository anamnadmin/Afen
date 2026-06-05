// models/errors/ErrorSeverity.ts
export enum ErrorSeverity {
  LOW = 'low',       // non-critical, can continue
  MEDIUM = 'medium', // may cause partial failure
  HIGH = 'high',     // significant impact
  CRITICAL = 'critical' // system halt or data corruption
}