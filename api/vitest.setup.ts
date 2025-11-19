// @ts-nocheck
import { beforeEach } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// dev.test.db を vitest.setup.ts と同じ api/ に置く
const dbPath = path.resolve(__dirname, '..', '..', 'dev.test.db');

beforeEach(() => {
  // DB が存在すれば削除
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  // schema.prisma に基づいて DB を再生成
  execSync('DATABASE_URL="file:./dev.test.db" npx prisma db push', {
    stdio: 'inherit',
  });
});
