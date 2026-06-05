// models/uir/UIRContext.ts
/**
 * Contextual information for UIR generation.
 */
export class UIRContext {
  constructor(
    public readonly language: string = 'javascript',
    public readonly environment: 'node' | 'browser' | 'unknown' = 'unknown',
    public readonly scope: Readonly<Record<string, string>> = {},
    public readonly additionalMetadata: Readonly<Record<string, unknown>> = {}
  ) {}

  merge(overrides: Partial<UIRContext>): UIRContext {
    return new UIRContext(
      overrides.language ?? this.language,
      overrides.environment ?? this.environment,
      { ...this.scope, ...overrides.scope },
      { ...this.additionalMetadata, ...overrides.additionalMetadata }
    );
  }
}