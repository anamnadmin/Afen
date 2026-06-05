#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

const SRC_DIR = path.resolve(process.cwd(), 'src');

function lint(): void {
  console.log('🔍 Linting Afen source code...\n');

  if (!existsSync(SRC_DIR)) {
    console.error(`❌ Source directory not found: ${SRC_DIR}`);
    process.exit(1);
  }

  try {
    execSync('npx eslint src --ext .ts --max-warnings 0', { stdio: 'inherit' });
    console.log('\n✅ Lint passed. No issues found.');
    process.exit(0);
  } catch {
    console.error('\n❌ Lint failed. Resolve the issues above and try again.');
    process.exit(1);
  }
}

lint();