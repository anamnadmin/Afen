// models/uir/UIRSource.ts
export class UIRSource {
  constructor(
    public readonly file: string,
    public readonly line: number = 1,
    public readonly column: number = 1,
    public readonly sourceText: string = '',
    public readonly language: string = 'unknown'
  ) {}

  toString(): string {
    return `${this.file}:${this.line}:${this.column}`;
  }
}