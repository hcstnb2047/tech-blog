// @ts-check
import { defineConfig } from 'astro/config';

// 最小構成: 完全静的サイト生成（SSG）。
// クライアントJSは原則ゼロ（zero-JS）で配信する。
export default defineConfig({
  output: 'static',
  // site は公開ドメイン確定後に設定する（sitemap/正規URL用）。
  // site: 'https://example.com',
});
