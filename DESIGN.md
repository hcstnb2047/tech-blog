# DESIGN.md — tech-blog（技術ノート）

> 視覚ルール・デザイントークンの単一ソース。実装(`global.css`/`config.ts`/各 .astro)はこれを根拠に書く。
> スタック: Astro v5(SSG) + Tailwind v4(@theme) + @tailwindcss/typography(prose) + Expressive Code。zero-JS志向(初期JS ≤ 50KB gzip)。

## 美的指向（zero-JS / 低メンテ / 清潔リッチ）
- 本文を主役にした単一カラム・余白で階層を作る「清潔リッチ」。装飾より可読性。
- フォントは system-ui 1系統のみ（フォント2種まで＝清潔さ優先）。色数は最小。
- prefers-color-scheme 追従でライト/ダーク自動切替（zero-JS維持）。

## タイポグラフィ
- **本文**: prose 既定（16px / 行間≈1.75）。左揃え。
- **読み幅**: 本文の1行を **60–75ch** に収める（現行 `max-w-2xl`＝約70–75ch。prose の `max-w-none` 上書きはコンテナ幅で制御）。
- **見出し**: h1 = text-3xl / font-bold / leading-tight / tracking-tight。見出しは `tracking-tight`。
- **副次テキスト**: メタ情報・出典・footer は text-sm / text-muted。
- フォント: `system-ui, -apple-system, "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Segoe UI", Roboto, sans-serif`（global.css の `--font-sans` を昇格）。

## スペーシングスケール（4/8px ベース・★今回の体系化対象）
- 採用スケール: **4 / 8 / 12 / 16 / 24 / 32 / 40px**（Tailwind `1/2/3/4/6/8/10`）。
- 一覧は `py-6`(24px) で 8px グリッドに統一済（iter1 で `py-5`→`py-6` 適用）。残りの縦リズムは off-grid なし。
- コンテナ: 横 `px-5`(20px)、セクション縦リズムはスケール内の値で統一。

## カラートークン（global.css から昇格・light / dark）
| トークン | light | dark | 用途 |
|---------|-------|------|------|
| `--bg`     | `#fcfcfb` | `#0e1116` | 背景 |
| `--fg`     | `#1f2328` | `#e6edf3` | 本文 |
| `--muted`  | `#6b7280` | `#9aa4b2` | 副次テキスト |
| `--accent` | `#2f5bd0` | `#6ea0ff` | リンク/強調 |
| `--border` | `#e6e7e3` | `#262c36` | 罫線 |
- `@theme` で `bg-bg/text-fg/text-muted/text-accent/border-border` として公開（dark 自動追従）。
- コントラスト: 本文 fg/bg は WCAG AA を満たす（⑤で客観確認）。

## コンポーネント原則
- **角丸**: Expressive Code は `borderRadius: 8px`。他要素も 8px 基調。
- **リンク**: prose 内は `text-accent` / 下線なし → hover で下線（`prose-a:no-underline hover:prose-a:underline`）。
- **コードブロック**: Expressive Code を主役級に（github-light/dark・行ハイライト・コピー）。
- **密度**: 一覧は `py-5→py-6` のゆったりリズム。影は使わず罫線(`border-border`)で区切る。

## デザイン参照（反復間で再利用）
| URL | 要点 | 適用箇所 |
|-----|------|---------|
| https://docs.astro.build/en/recipes/tailwind-rendered-markdown/ | prose一括整形・max-w-prose≈65ch | 本文読み幅 |
| https://www.adoc-studio.app/blog/typography-guide | 16px/行長60-75ch/行間1.5/左揃え/単一カラム | タイポ全般 |
| https://www.digitalsilk.com/digital-trends/minimalist-web-design-trends/ | 余白で階層・フォント2種まで | 美的指向/余白 |

<!-- ui-iterate パイロット iter1（2026-06-07）で確定（フェーズ⑥承認済）。 -->
