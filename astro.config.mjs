// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';

// 完全静的サイト生成（SSG）。本文クライアントJSは原則ゼロ。
// - Tailwind v4: @tailwindcss/vite で読み込む（2026の推奨方式）
// - Expressive Code: コードブロックを主役級に（テーマ/行ハイライト/コピー/タイトル）
//   ※ EC のコピーボタンのみ極小JSが付く（フレームワークランタイムではない）
export default defineConfig({
  output: 'static',
  // EC は md/mdx より前に置く（コードブロック処理の順序が重要）
  integrations: [
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      // OS のライト/ダーク設定に追従（zero-JS なメディアクエリ方式）
      useDarkModeMediaQuery: true,
      styleOverrides: { borderRadius: '8px' },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  // site は公開ドメイン確定後に設定する（sitemap/正規URL用）。
});
