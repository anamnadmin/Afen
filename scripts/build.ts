#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';
import path from 'path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');

function build(): void {
  console.log('🔨 Building Afen...\n');

  if (existsSync(DIST_DIR)) {
    console.log('🧹 Cleaning previous build...');
    rmSync(DIST_DIR, { recursive: true, force: true });
    console.log('   Done.\n');
  }

  try {
    execSync('npx tsc', { stdio: 'inherit' });
    console.log('\n✅ Build completed successfully!');
    console.log(`📦 Output directory: ${DIST_DIR}`);
    process.exit(0);
  } catch {
    console.error('\n❌ Build failed. Fix the TypeScript errors above and try again.');
    process.exit(1);
  }
}

build();