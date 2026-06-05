// queries/executor/QueryResult.ts
export interface QueryResultData {
  command: string;
  target: string;
  output: any;
  explanation?: string;
  executionTimeMs: number;
}

export class QueryResult {
  constructor(
    public readonly success: boolean,
    public readonly data: QueryResultData | null,
    public readonly error: string | null = null
  ) {}

  static success(command: string, target: string, output: any, explanation: string | undefined, timeMs: number): QueryResult {
    return new QueryResult(true, { command, target, output, explanation, executionTimeMs: timeMs }, null);
  }

  static failure(error: string): QueryResult {
    return new QueryResult(false, null, error);
  }

  toJSON(): object {
    return {
      success: this.success,
      data: this.data,
      error: this.error,
    };
  }
}