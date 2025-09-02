import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';

config({ path: '.env.test' });

export default defineConfig({
  test: {
    globals: true,
    setupFiles: 'test/setup.ts',
    // coverage: {
    //   provider: 'v8',
    //   reporter: ['text', 'html'],
    //   clean: true,
    //   reportsDirectory: './test/coverage',
    //   include: ['src/**/*.ts'],
    //   exclude: ['test/**/*.ts'],
    // },
  },
});
