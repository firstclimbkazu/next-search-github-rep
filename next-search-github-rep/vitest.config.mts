// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path'; // path.resolve を使用しないため、この行は削除しても構いません


export default defineConfig({
  // vite-tsconfig-paths を削除し、react プラグインのみ使用します
  plugins: [react()],
  test: {
    environment: 'jsdom', // または 'happy-dom'
    globals: true, // `describe`, `it` などをグローバルに利用可能にする
    setupFiles: ['./tests/vitest.setup.ts'], // テスト実行前に読み込むファイル
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
  // tsconfig.json の paths の代わりとなる設定をここに記述します
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
