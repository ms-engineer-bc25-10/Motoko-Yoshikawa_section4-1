// @ts-nocheck
import { beforeAll } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(__dirname, '..', '..', 'dev.test.db');

beforeAll(() => {
  // DB が存在すれば削除
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  // schema.prisma に基づいて空のDBを再生成
  execSync('DATABASE_URL="file:./dev.test.db" npx prisma db push', {
    stdio: 'inherit',
  });
});
