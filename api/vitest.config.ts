import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
    pool: 'threads',
  },
});

dotenv.config({ path: '.env.test' });
