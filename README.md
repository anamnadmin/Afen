
---

## `package.json`

```json
{
  "name": "afen",
  "version": "1.0.0",
  "description": "A modular error-explanation and reasoning engine for complex systems.",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "lint": "eslint . --ext .ts",
    "bench": "node benchmarks/run.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/v-1908/Afen.git"
  },
  "keywords": [
    "error-detection",
    "explainability",
    "reasoning-engine",
    "typescript",
    "nodejs"
  ],
  "author": "Afen Contributors",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/v-1908/Afen/issues"
  },
  "homepage": "https://github.com/v-1908/Afen#readme",
  "devDependencies": {
    "typescript": "^5.7.3",
    "ts-node": "^10.9.2",
    "jest": "^29.7.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}