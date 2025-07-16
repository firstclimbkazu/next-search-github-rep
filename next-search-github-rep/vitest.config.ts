// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // または 'happy-dom'
    globals: true, // `describe`, `it` などをグローバルに利用可能にする
    setupFiles: ['./vitest.setup.ts'], // テスト実行前に読み込むファイル
    include: ['**/*.{test,spec}.{ts,tsx}'], // テストファイルのパターン
    coverage: {
      provider: 'v8', // コードカバレッジプロバイダ
      reporter: ['text', 'json', 'html'], // レポート形式
      exclude: [
        'node_modules/',
        '.next/',
        '**/__mocks__/',
        '**/__fixtures__/',
        '**/*.d.ts',
      ],
    },
  },
});
