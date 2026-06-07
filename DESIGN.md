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
- **トップのヒーロー（サイト名）**: 例外的に主役級。`text-4xl`（sm:`text-5xl`）/ font-bold / tracking-tight。下に `--muted` のタグライン（`SITE_DESCRIPTION`）を `mt-3`(12px) で添え、`pb-8`(32px)＋`border-b` で本文と分離。記事ページの h1（text-3xl）とは役割が異なる。
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
- **アクセント運用**: accent はリンク/フォーカス/選択ハイライトに限定（多用しない＝清潔リッチ）。影は使わず罫線(`--border`)で面を分ける方針を維持（light/dark とも陰影レス）。
- **テキスト選択**: `::selection` を `color-mix(in srgb, var(--accent) 18%, transparent)` で淡く色付け（light/dark 自動追従・本文の可読性を保つ薄さ）。
- **フォーカス可視化(a11y)**: `:where(a,button,[tabindex]):focus-visible` に `outline: 2px var(--accent)` + `outline-offset:2px`。マウス時は出さず（`:focus-visible`）キーボード操作時のみ表示。一覧カードは `group-focus-within:text-accent` で hover と同じ affordance をキーボードにも付与。
- **トランジション**: リンクの色変化に `transition-colors`。`prefers-reduced-motion: reduce` で `transition-duration` を実質無効化（モーション過敏配慮）。
- **コントラスト(WCAG AA 客観確認 / 相対輝度で算出)**: light = muted/bg ≈ 4.76、accent/bg ≈ 5.86。dark = muted/bg ≈ 7.50、accent/bg ≈ 7.33。fg/bg は両モードとも十分高い。いずれも本文(4.5)基準を満たす（text-xs の日付も normal 扱いで満たす）。→ トークン値の変更は不要と判断。

## コンポーネント原則
- **角丸**: Expressive Code は `borderRadius: 8px`。他要素も 8px 基調（inline code は `rounded-md`）。
- **リンク**: prose 内は `text-accent` / 太字化しない（`prose-a:font-normal`＝色で識別）/ 下線なし → hover で下線（`prose-a:no-underline prose-a:underline-offset-2 hover:prose-a:underline`）。
- **コードブロック**: Expressive Code を主役級に（github-light/dark・行ハイライト・コピー）。
- **インラインコード**: `prose-code:before/after:content-none` でバッククォート除去。`:not(pre)>code` のみを対象に淡い地色（`bg-fg/[0.06]`＝ライト/ダーク自動追従）＋ `px-1.5 py-0.5`＋`rounded-md`＋`text-[0.9em]`＋太字化しない（`font-normal`）。`:not(pre)>code` で限定し Expressive Code のブロックには干渉させない。
- **本文見出しの縦リズム**: prose 既定の見出し余白は 8px グリッドに整合（h2 上48/下24px、h3 上32/下12px）ため上書きしない。記事 h1→`time`→本文は `mb-2`(8)→`mb-10`(40) でスケール内。
- **密度**: 一覧は `py-5→py-6` のゆったりリズム。影は使わず罫線(`border-border`)で区切る。
- **記事一覧の行**: タイトル(h2 / text-lg / font-semibold)＋ `description` 1行(text-sm / `--muted` / `mt-1`)＋日付(time / text-xs / `--muted` / `mt-2`)。行は `group relative`、タイトルの `<a>` に `after:absolute after:inset-0` を当てる stretched-link でカード全体を1タップ可能に（リンク文言はタイトルのみ＝a11y維持）。hover で `group-hover:text-accent`＝リンク affordance。

## ヘッダー / フッター体裁
- **ヘッダー**: サイト名（`font-bold tracking-tight`）はトップへのリンク。`transition-colors` + `hover:text-accent`。`max-w-2xl px-5 py-4` で本文幅に揃える。
- **フッター**: `flex justify-between` で「© year サイト名」（左）と「トップへ」リンク（右）を配置。全体 `text-sm text-muted`、リンクは `hover:text-accent`。zero-JS のページ内移動補助（`href="/"`）。

## デザイン参照（反復間で再利用）
| URL | 要点 | 適用箇所 |
|-----|------|---------|
| https://docs.astro.build/en/recipes/tailwind-rendered-markdown/ | prose一括整形・max-w-prose≈65ch | 本文読み幅 |
| https://www.adoc-studio.app/blog/typography-guide | 16px/行長60-75ch/行間1.5/左揃え/単一カラム | タイポ全般 |
| https://www.digitalsilk.com/digital-trends/minimalist-web-design-trends/ | 余白で階層・フォント2種まで | 美的指向/余白 |

<!-- ui-iterate パイロット iter1（2026-06-07）で確定（フェーズ⑥承認済）。 -->
