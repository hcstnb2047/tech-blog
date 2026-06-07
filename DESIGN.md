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
- **`color-scheme`**: `:root` に `color-scheme: light dark` を宣言。UA にライト/ダーク両対応を伝え、ネイティブUI（スクロールバー/フォーム部品）と CSS 適用前の初期描画もダーク時に背景へ追従させる（ダーク時の白フラッシュ防止・zero-JS）。`prefers-color-scheme` のトークン差し替えと併用。
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

## 目次（記事内 TOC）
- **方針**: 技術記事のセクション間移動と deep-link を zero-JS で提供する。Astro が Markdown 見出しに自動採番する `id`（github-slugger）と `render()` の `headings` をそのまま使い、**rehype 等の新規依存は入れない**。
- **対象**: セクション見出し（`depth === 2` の H2）のみ。`toc.length >= 2` の記事だけ表示（短い記事ではノイズになるため）。
- **配置/体裁**: 記事メタ（日付・読了時間）の直後・本文 prose の前。`rounded-md border border-border px-5 py-4` の囲みに、ラベル「目次」と `<ol>`（`text-sm` / `--muted` / `hover:text-accent` + `hover:underline`）。
- **a11y**: `<nav aria-label="目次">` のランドマークで命名。**見出しアウトラインを汚さないようラベルは `<p>`**（`<h2>` にしない）＝記事の見出し階層は h1→本文 h2 のまま。リンク先は Astro 自動 `id`（`#slug`）。

## SEO / 共有メタ（OGP・Twitter Card）
- **方針**: リンクプレビュー（Slack/Discord/Facebook/X 等）を zero-JS で成立させる。`BaseLayout` の `<head>` に静的 `<meta>` のみで構成（クライアントJSなし・新規依存なし）。
- **ドキュメントタイトルのブランディング**: ブラウザタブ/検索結果向けに `<title>` をサイト名でブランディングする。整形は `BaseLayout` で一元化（`title === SITE_NAME ? SITE_NAME : `${title} — ${SITE_NAME}``）。トップは二重化回避でサイト名のみ、記事/404 等は「ページ名 — サイト名」。**`og:title`/`twitter:title` は素の `title`** を保つ（リンクプレビューにサイト名を重ねない＝ドキュメントタイトルと分離）。各ページは素のページ名を `title` に渡すだけでよい（404 もブランディング付与は層に委譲）。
- **theme-color（モバイルブラウザ UI の質感）**: `<meta name="theme-color" media="(prefers-color-scheme: …)">` を light/dark の 2 本出し、モバイルのアドレスバー等を `--bg`（light `#fcfcfb`／dark `#0e1116`）に同色化する（zero-JS・新規依存なし）。**値は `global.css` の `--bg` と手動同期**（meta は CSS 変数を読めないため。トークン変更時は両方更新）。
- **常時出力**: `og:type`（既定 `website`／記事は `article`）・`og:title`・`og:description`・`og:site_name`・`og:locale=ja_JP`・`twitter:card=summary`・`twitter:title`・`twitter:description`。
- **絶対URL依存タグは条件付き**: `canonical` / `og:url` は **`astro.config` の `site` 設定後のみ**出力（`new URL(Astro.url.pathname, Astro.site)`）。ドメイン未確定の現状では誤った相対URLを露出させないため出さない＝`site` を設定すれば自動で有効化される。
- **画像**: OGP/Twitter 画像は絶対URL必須のためドメイン確定まで保留（`twitter:card` は `summary`）。確定後に `og:image` と `summary_large_image` を検討。
- **構造化データ（JSON-LD）**: 検索エンジンにページ種別を伝えるため `<script type="application/ld+json">` を `<head>` に出力する。これは UA が**実行しない静的データ**（解釈して読むだけ）なので zero-JS 方針に反しない。トップ/一覧は `WebSite`（`name`/`description`/`inLanguage=ja-JP`）、記事は `BlogPosting`（`headline`/`description`/`inLanguage`/`datePublished`/`author`/`publisher`）。**`url`/`mainEntityOfPage` は絶対URL必須のため `canonical` と同様に `astro.config` の `site` 設定時のみ付与**（未設定なら省略＝誤URLを出さない）。整形は `BaseLayout` で一元化。
- **記事ページ**: `type="article"` ＋ `article:published_time`（`publishedAt`）を付与。`BaseLayout` の Props は `type?: 'website'|'article'` / `publishedAt?: string`（任意）。

## 読了時間 / 404

- **読了時間（メタ）**: 一覧・記事ページの日付の隣に「約N分」を併記し、記事の分量を読む前に伝える（一覧の「読みたくなる形」を強化）。算出は `src/utils/readingTime.ts` の `readingTimeMin()`（ビルド時・新規依存なし）。日本語主体のため語数でなく**文字数ベース（500字/分）**で概算し、コードブロック/インラインコード/リンク記法は散文でないため除外して数える。区切りは中黒（`·`・`aria-hidden`）で日付と並置（一覧 text-xs / 記事 text-sm・ともに `--muted`）。
- **404 ページ**: `src/pages/404.astro`（静的ビルドで `404.html` を生成）。`BaseLayout` 準拠・既存トークンのみ・zero-JS。`text-accent` の「404」ラベル＋h1＋説明＋「← 記事一覧へ戻る」リンク（`href="/"`）。ヘッダー/フッターの戻り導線も共通レイアウト経由でそのまま機能する。

## a11y / 細部の体裁
- **スキップリンク**: `<body>` 先頭に「本文へスキップ」（`href="#main"`）。通常は `sr-only` で視覚的に隠し、キーボードフォーカス時のみ `focus:not-sr-only` で左上に表示（`bg-bg`＋`border-border`＋`text-accent`）。`<main id="main">` を着地点に。繰り返すヘッダーをスキップして本文へ直接移動できる（zero-JS・新規依存なし）。
- **日付表記**: `publishedAt`（`YYYY-MM-DD`）は日本語表記（例: `2026年6月7日`）で表示する。整形は `src/utils/date.ts` の `formatDateJa()`（ビルド時・`new Date()` を介さず文字列分解で TZ ズレを回避）。機械可読性のため `<time datetime>` には ISO 値（`YYYY-MM-DD`）を保持。一覧・記事ページとも同じ整形を使う。

## ヘッダー / フッター体裁
- **ヘッダー**: サイト名（`font-bold tracking-tight`）はトップへのリンク。`transition-colors` + `hover:text-accent`。`max-w-2xl px-5 py-4` で本文幅に揃える。
- **フッター**: `flex justify-between` で「© year サイト名」（左）と「トップへ」リンク（右）を配置。全体 `text-sm text-muted`、リンクは `hover:text-accent`。zero-JS のページ内移動補助（`href="/"`）。
- **記事内の戻り導線**: 記事ページ本文上部に「← 記事一覧へ」（`href="/"`・`text-sm text-muted` / `hover:text-accent` / `transition-colors`）を配置。ヘッダー/フッターに加え本文先頭にも戻り口を用意（読了直前でなくスクロール前に到達できる）。

## デザイン参照（反復間で再利用）
| URL | 要点 | 適用箇所 |
|-----|------|---------|
| https://docs.astro.build/en/recipes/tailwind-rendered-markdown/ | prose一括整形・max-w-prose≈65ch | 本文読み幅 |
| https://www.adoc-studio.app/blog/typography-guide | 16px/行長60-75ch/行間1.5/左揃え/単一カラム | タイポ全般 |
| https://www.digitalsilk.com/digital-trends/minimalist-web-design-trends/ | 余白で階層・フォント2種まで | 美的指向/余白 |

<!-- ui-iterate パイロット iter1（2026-06-07）で確定（フェーズ⑥承認済）。 -->
