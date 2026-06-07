// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
// Astro 同梱パッケージ（新規 install なし）。Astro の見出し id 採番はデフォルトでは
// ユーザー rehype プラグインより後に走るため、これを先頭で明示的に再実行して id を
// 確定させてから下の rehypeHeadingAnchors で「#」リンクを足す（公式の順序パターン）。
import { rehypeHeadingIds } from '@astrojs/markdown-remark';

// 見出しアンカーリンク（zero-JS / 新規依存ゼロ）。
// Astro が Markdown 見出しに自動採番する id（github-slugger）を使い、各見出し
// 末尾に「#」リンク（同 id への deep-link）を足すだけの小さな rehype 関数。
// - 新規 npm 依存なし: Astro のマークダウン処理が既に作る HAST ツリーを手で歩いて
//   ノードを足すだけ（unist-util-visit 等も import しない＝純粋なツリー走査）。
// - zero-JS: 出力は静的な <a href="#id"> のみ（クライアント JS を増やさない）。
// - a11y: アンカーは aria-hidden + tabindex=-1（マウス hover 時の補助）。キーボード/AT
//   利用者にはセクション目次(TOC)が既に deep-link を提供するため二重化を避ける。
function rehypeHeadingAnchors() {
  const isAnchorTarget = (n) =>
    n.type === 'element' &&
    (n.tagName === 'h2' || n.tagName === 'h3' || n.tagName === 'h4') &&
    n.properties &&
    n.properties.id;
  const walk = (node) => {
    if (!node || !node.children) return;
    for (const child of node.children) {
      if (isAnchorTarget(child)) {
        child.children.push({
          type: 'element',
          tagName: 'a',
          properties: {
            href: '#' + child.properties.id,
            className: ['heading-anchor'],
            'aria-hidden': 'true',
            tabIndex: -1,
          },
          children: [{ type: 'text', value: '#' }],
        });
      }
      walk(child);
    }
  };
  return walk;
}

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
  // 見出しに「#」deep-link を付与（Astro の id 採番後に走る・zero-JS / 新規依存ゼロ）。
  markdown: { rehypePlugins: [rehypeHeadingIds, rehypeHeadingAnchors] },
  // site は公開ドメイン確定後に設定する（sitemap/正規URL用）。
});
