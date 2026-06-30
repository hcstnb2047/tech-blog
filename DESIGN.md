# DESIGN.md — tech-blog（技術ノート）

> 視覚ルール・デザイントークンの単一ソース。実装(`global.css`/`config.ts`/各 .astro)はこれを根拠に書く。
> スタック: Astro v5(SSG) + Tailwind v4(@theme) + @tailwindcss/typography(prose) + Expressive Code。
>   near-zero-JS志向: ランタイムJSは持たず、モーションは CSS-only。初期JS予算 ≤ 50KB gzip は維持。
>   （将来 View Transitions を入れる場合のみ最小JSを許容＝現時点では入れない）。

## 美的指向（二層構成：顔＝ラボノート / 本文＝清潔リッチ）
このサイトは「検証の場（作って・動かして・確かめた記録）」であり、2つの役割を持つ二層構成。
- **顔（トップ/一覧）＝ラボノート**: 第一印象で「この人いろいろ動かしてるな」と伝える。
  惹きは"映え"でなく **タイトル＋タグ（分類）＋鮮度（最新の検証）**。装飾画像に頼らずテキスト先行で密度と新しさを見せる。
- **本文（記事ページ）＝清潔リッチ（不変）**: 従来方針を維持。単一カラム・余白で階層・装飾より可読性・prose主役。
  **記事ページ・TOC・コントラスト・SEO・404 はこの改修で触らない**（既に高品質）。
- フォントは system-ui 1系統のまま（顔でも書体は増やさない＝レイアウト/分類/鮮度で個性を出す）。色数は最小。
- prefers-color-scheme 追従でライト/ダーク自動切替（near-zero-JS維持）。

## トップ＝ラボノートグリッド（顔・★iter2 主題転換 2026-06-16）
> 「単調で退屈」を脱却するための顔の作り替え。**映えでなく鮮度＋分類で惹く**。grill 決定台帳 D1–D7 に基づく。
- **鮮度（最新の検証）**: 記事を `publishedAt` 降順で出し、**最新1〜2件を前面**に置いて「いま検証してる感」を出す。
  鮮度は **記事から自動導出**＝手書きの近況欄は作らない（更新を忘れて腐るため）。記事を書く＝近況が自動更新。
- **カード**: 記事をテキスト先行カードで並べる。中身＝タイトル(font-semibold)＋説明1行＋**タグチップ**＋メタ(日付·読了)。
  カバー画像は**使わない**（自動生成も今回スコープ外＝新規依存ゼロ・低メンテ。寂しければ後で再検討＝先回りしない）。
  stretched-link（`after:absolute after:inset-0`）でカード全体1タップは踏襲。
- **影の限定解禁**: 顔のカードに**限り**影を許可（従来「影レス」の例外。詳細は §カラートークン「影」）。
  既定 `shadow-sm`、hover で `shadow-md`＋`-translate-y-0.5`（lift）。本文・記事ページの罫線方針は不変。
- **モーション予算**: CSS-only の hover lift（transform/shadow の transition）のみ。
  `prefers-reduced-motion: reduce` で lift・transition を無効化。JS製アニメーション（framer-motion 等）は入れない。

## タグ（分類・軽量／色味で清潔さを壊さない）
- **目的**: 「何系の検証か」を一目で。鮮度と並ぶ第2の惹き。`content.config.ts` の strictObject に `tags` を追加。
- **PII安全弁の維持**: スキーマは公開可フィールドの allowlist。`tags` 追加後も健康/個人情報はタグに書かない運用。
- **チップ体裁（虹色禁止）**: **全タグ同一の地味なスタイル**＝`border border-border`＋`bg-fg/[0.04]`（淡い地色・light/dark自動追従）
  ＋`text-muted`＋`text-xs`＋`px-1.5 py-0.5`＋`rounded-md`。**タグごとに色を変えない・accent は使わない**。
  罫線でチップの輪郭を出す（地色だけだとダーク背景に溶けて分類フックが効かない・ui-critic iter2 指摘）。
  区別は**ラベル文字**でする（例「AIエージェント」「Astro」）。画面を持たせるのは色でなく構造（階層＋鮮度＋余白）。
- **機構は作らない**: タグ別アーカイブ/絞り込みページは作らない（記事数が少ない現状では過剰・欲しくなってから）。

## タイポグラフィ
- **本文**: prose 既定（16px / 行間≈1.75）。左揃え。
- **読み幅**: 本文の1行を **60–75ch** に収める（現行 `max-w-2xl`＝約70–75ch。prose の `max-w-none` 上書きはコンテナ幅で制御）。
- **見出し**: h1 = text-3xl / font-bold / leading-tight / tracking-tight。見出しは `tracking-tight`。
- **トップのヒーロー（サイト名）**: 例外的に主役級。`text-4xl`（sm:`text-5xl`）/ font-bold / tracking-tight。ラボノートグリッドの上に置く。下に `--muted` のタグライン（`SITE_DESCRIPTION`）を `mt-3`(12px) で添え、`pb-8`(32px)＋`border-b` でグリッドと分離。**タグラインは「検証の場」だと伝える1行**（`config.ts` の `SITE_DESCRIPTION`＝「作って・動かして・確かめた」系・盛らない等身大）。記事ページの h1（text-3xl）とは役割が異なる。
- **副次テキスト**: メタ情報・出典・footer は text-sm / text-muted。
- フォント: `system-ui, -apple-system, "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Segoe UI", Roboto, sans-serif`（global.css の `--font-sans` を昇格）。

## スペーシングスケール（4/8px ベース・★今回の体系化対象）
- 採用スケール: **4 / 8 / 12 / 16 / 24 / 32 / 40px**（Tailwind `1/2/3/4/6/8/10`）。
- 一覧は `py-6`(24px) で 8px グリッドに統一済（iter1 で `py-5`→`py-6` 適用）。残りの縦リズムは off-grid なし。
- コンテナ: 横 `px-5`(20px)、セクション縦リズムはスケール内の値で統一。

## カラートークン（global.css から昇格・light / dark）
| トークン | light | dark | 用途 |
|---------|-------|------|------|
| `--bg`     | `#fbfaf7` | `#0e1116` | 背景（light はオフホワイト＝note的な紙の温さ） |
| `--fg`     | `#1f2328` | `#e6edf3` | 本文 |
| `--muted`  | `#6b7280` | `#9aa4b2` | 副次テキスト |
| `--accent` | `#3b7a6f` | `#6fb3a6` | リンク/強調（teal＝主張しない温色。冷たい青を退役・iter3） |
| `--border` | `#efeae2` | `#2b333d` | 罫線（light はベージュ寄りで線を柔らかく） |
| `--card`   | `#ffffff` | `#171c23` | カードの面（顔のラボノートカードのみ・地から持ち上げる） |
- `@theme` で `bg-bg/text-fg/text-muted/text-accent/border-border` として公開（dark 自動追従）。
- **`color-scheme`**: `:root` に `color-scheme: light dark` を宣言。UA にライト/ダーク両対応を伝え、ネイティブUI（スクロールバー/フォーム部品）と CSS 適用前の初期描画もダーク時に背景へ追従させる（ダーク時の白フラッシュ防止・zero-JS）。`prefers-color-scheme` のトークン差し替えと併用。
- **アクセント運用**: accent はリンク/フォーカス/選択ハイライトに限定（多用しない＝清潔リッチ）。タグチップには使わない（§タグ）。
- **影**: 本文・記事ページは罫線(`--border`)で面を分ける方針を維持（light/dark とも陰影レス）。
  **例外＝トップ（顔）のラボノートカードのみ影を許可**（`shadow-sm`／hover `shadow-md`＋lift）。影を使うのはこの1箇所に限定し、清潔リッチの本文には波及させない。
- **カードの面（`--card`）＝ダークでの階層表現**: ダークでは影がほぼ不可視なので、カードは `bg-card`（bgより明るい面）で「持ち上がり」を**色**で示す（GitHub 等と同じ王道）。
  影だけに頼ると light でしか階層が伝わらず「枠で囲っただけ」に見える問題への対処（実機ダーク＋スマホで体感ゼロだった指摘・iter2.1）。hover は dark で見えるよう `hover:border-fg/20`（罫線brighten）＋lift を併用。
- **テキスト選択**: `::selection` を `color-mix(in srgb, var(--accent) 18%, transparent)` で淡く色付け（light/dark 自動追従・本文の可読性を保つ薄さ）。
- **フォーカス可視化(a11y)**: `:where(a,button,[tabindex]):focus-visible` に `outline: 2px var(--accent)` + `outline-offset:2px`。マウス時は出さず（`:focus-visible`）キーボード操作時のみ表示。一覧カードは `group-focus-within:text-accent` で hover と同じ affordance をキーボードにも付与。
- **トランジション**: リンクの色変化に `transition-colors`。`prefers-reduced-motion: reduce` で `transition-duration` を実質無効化（モーション過敏配慮）。
- **コントラスト(WCAG AA 客観確認 / 相対輝度で算出)**: light = muted/bg ≈ 4.76、accent/bg ≈ **4.79**（teal・iter3／accent/card白 ≈ 5.00）。dark = muted/bg ≈ 7.50、accent/bg ≈ **7.88**（teal・iter3）。fg/bg は両モードとも十分高い。いずれも本文(4.5)基準を満たす。→ teal化後も AA を維持（旧青 light 5.86/dark 7.33 から僅かに変動するが安全圏・トークン値は確定）。

## コンポーネント原則
- **角丸**: Expressive Code は `borderRadius: 8px`。他要素も 8px 基調（inline code は `rounded-md`）。
- **リンク**: prose 内は `text-accent` / 太字化しない（`prose-a:font-normal`＝色で識別）/ 下線なし → hover で下線（`prose-a:no-underline prose-a:underline-offset-2 hover:prose-a:underline`）。
- **コードブロック**: Expressive Code を主役級に（github-light/dark・行ハイライト・コピー）。
- **インラインコード**: `prose-code:before/after:content-none` でバッククォート除去。`:not(pre)>code` のみを対象に淡い地色（`bg-fg/[0.06]`＝ライト/ダーク自動追従）＋ `px-1.5 py-0.5`＋`rounded-md`＋`text-[0.9em]`＋太字化しない（`font-normal`）。`:not(pre)>code` で限定し Expressive Code のブロックには干渉させない。
- **本文見出しの縦リズム**: prose 既定の見出し余白は 8px グリッドに整合（h2 上48/下24px、h3 上32/下12px）ため上書きしない。記事 h1→`time`→本文は `mb-2`(8)→`mb-10`(40) でスケール内。
- **密度**: 顔はカードグリッド（モバイル1列 / sm以上2列）。カード内はゆったりした縦リズム。
- **記事カード（iter2 で行→カードに変更）**: `group relative rounded-xl border border-border p-5 shadow-sm transition group-hover:shadow-md group-hover:-translate-y-0.5`。
  中身＝タイトル(h2 / text-lg / font-semibold)＋ `description`(text-sm / `--muted` / `mt-1` / **`line-clamp-2`** でカード高さを揃える)＋**タグチップ列**(`mt-3`・§タグ)＋メタ(time・読了時間 / text-sm / `--muted` / `mt-auto pt-3` で下端揃え)。
  タイトルの `<a>` に `after:absolute after:inset-0` を当てる stretched-link でカード全体を1タップ可能に（リンク文言はタイトルのみ＝a11y維持）。
  **rest は `text-fg` で清潔に保ち、hover/focus でリンク affordance を二重提示**: タイトルに `group-hover:text-accent group-hover:underline`(`underline-offset-4`)。キーボードは `group-focus-within:` で同等。影の lift と reduced-motion は §トップ＝ラボノートグリッド。
  **最新1〜2件は前面強調**（鮮度）＝先頭カードを `sm:col-span-2` で全幅にする等で「最新の検証」を大きく見せる。

## 目次（記事内 TOC）
- **方針**: 技術記事のセクション間移動と deep-link を zero-JS で提供する。Astro が Markdown 見出しに自動採番する `id`（github-slugger）と `render()` の `headings` をそのまま使い、**rehype 等の新規依存は入れない**。
- **対象**: セクション見出し（`depth === 2` の H2）のみ。`toc.length >= 2` の記事だけ表示（短い記事ではノイズになるため）。
- **配置/体裁**: 記事メタ（日付・読了時間）の直後・本文 prose の前。`rounded-md border border-border px-5 py-4` の囲みに、ラベル「目次」と `<ol>`（`text-sm` / `--muted` / `hover:text-accent` + `hover:underline`）。
- **a11y**: `<nav aria-label="目次">` のランドマークで命名。**見出しアウトラインを汚さないようラベルは `<p>`**（`<h2>` にしない）＝記事の見出し階層は h1→本文 h2 のまま。リンク先は Astro 自動 `id`（`#slug`）。
- **アンカー移動の着地体験（zero-JS）**: 目次の `#slug` ジャンプとスキップリンクの `#main` ジャンプ共通で、`:root`(html) に `scroll-padding-top: 1.5rem`（24px=8pxグリッド）を付け、着地見出しが画面端に貼り付かないよう上余白を確保する。`scroll-behavior: smooth` で移動量を可視化し現在位置を見失わせない。**`prefers-reduced-motion: reduce` 時は `scroll-behavior: auto !important` に戻す**（モーション過敏配慮・既存の transition 無効化ブロックと同居）。
- **見出しアンカー「#」（zero-JS / 新規依存ゼロ）**: 本文 prose の H2–H4 末尾に同 id への deep-link「#」を付与し、読者がセクション URL を取得できるようにする（技術記事の定番アフォーダンス）。生成は `astro.config` の小さな rehype 関数 `rehypeHeadingAnchors`＝Astro が既に作る HAST ツリーを手で歩いて `<a class="heading-anchor" href="#id">` を足すだけ（`unist-util-visit` 等も import しない＝**新規 npm 依存ゼロ**・出力は静的 `<a>` のみ＝**zero-JS**）。Astro の id 採番はデフォルトでユーザー rehype より後に走るため、Astro 同梱の `rehypeHeadingIds`（新規 install なし）を `rehypePlugins` の先頭に置き id 確定後に「#」を足す（公式の順序パターン）。**id を持つ見出しのみ対象**＝出典 footer の `<h2>`（id なし・prose 外）には付かず TOC のスラッグとも完全一致。**体裁**: 通常は `opacity:0` で隠し、見出し hover 時のみ `--muted`→`--accent` で淡く表示（`margin-left:.35em`・下線なし）。**a11y**: アンカーは `aria-hidden="true"`＋`tabindex="-1"`＝マウス利用者向けの補助に限定し、キーボード/AT 利用者には目次(TOC)が既に deep-link を提供するため二重化・タブストップ増を避ける。

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

- **読了時間（メタ）**: 一覧・記事ページの日付の隣に「約N分」を併記し、記事の分量を読む前に伝える（一覧の「読みたくなる形」を強化）。算出は `src/utils/readingTime.ts` の `readingTimeMin()`（ビルド時・新規依存なし）。日本語主体のため語数でなく**文字数ベース（500字/分）**で概算し、コードブロック/インラインコード/リンク記法は散文でないため除外して数える。区切りは中黒（`·`・`aria-hidden`）で日付と並置（一覧・記事とも text-sm・`--muted`）。
- **404 ページ**: `src/pages/404.astro`（静的ビルドで `404.html` を生成）。`BaseLayout` 準拠・既存トークンのみ・zero-JS。`text-accent` の「404」ラベル＋h1＋説明＋「← 記事一覧へ戻る」リンク（`href="/"`）。ヘッダー/フッターの戻り導線も共通レイアウト経由でそのまま機能する。

## a11y / 細部の体裁
- **スキップリンク**: `<body>` 先頭に「本文へスキップ」（`href="#main"`）。通常は `sr-only` で視覚的に隠し、キーボードフォーカス時のみ `focus:not-sr-only` で左上に表示（`bg-bg`＋`border-border`＋`text-accent`）。`<main id="main">` を着地点に。繰り返すヘッダーをスキップして本文へ直接移動できる（zero-JS・新規依存なし）。
- **日付表記**: `publishedAt`（`YYYY-MM-DD`）は日本語表記（例: `2026年6月7日`）で表示する。整形は `src/utils/date.ts` の `formatDateJa()`（ビルド時・`new Date()` を介さず文字列分解で TZ ズレを回避）。機械可読性のため `<time datetime>` には ISO 値（`YYYY-MM-DD`）を保持。一覧・記事ページとも同じ整形を使う。

## ヘッダー / フッター体裁
- **ヘッダー**: サイト名（`font-bold tracking-tight`）はトップへのリンク。`transition-colors` + `hover:text-accent`。`max-w-2xl px-5 py-4` で本文幅に揃える。
- **フッター**: `flex justify-between` で「© year サイト名」（左）と「トップへ」リンク（右）を配置。全体 `text-sm text-muted`、リンクは `hover:text-accent`。zero-JS のページ内移動補助（`href="/"`）。
- **記事内の戻り導線**: 記事ページ本文上部に「← 記事一覧へ」（`href="/"`・`text-sm text-muted` / `hover:text-accent` / `transition-colors`）を配置。ヘッダー/フッターに加え本文先頭にも戻り口を用意（読了直前でなくスクロール前に到達できる）。

## 折り返し品質 / 印刷（zero-JS）
- **見出しの折り返し**: `:where(h1,h2,h3,h4)` に `text-wrap: balance`＝複数行見出しの行長を均等化し「ぶら下がり1単語」を防ぐ（清潔リッチ・タイポ階層 G3 の延長）。
- **日本語見出しの分断品質（CJK 折り返し）**: 見出し/タイトルに `line-break: strict`＝小書き仮名・長音符・句読点などの前で改行させず禁則を厳格化する。さらに `@supports (word-break: auto-phrase)` 内で `word-break: auto-phrase` を付与し、**文節(Bunsetsu)境界で改行**して「括弧内・文中での不自然な分断」（例: 一覧/記事 h1 の `…で「安／全に公開する」`）を解消する。`auto-phrase` は Chrome 119+ のみ対応＝**非対応(Safari/Firefox)は既定の禁則にフォールバック**し、`balance` と併用するのが日本語での推奨形（zero-JS・新規依存ゼロ・プログレッシブエンハンスメント）。
- **本文の折り返し**: `:where(p,li)` に `text-wrap: pretty`＝末尾のオーファン行を抑えラグを整える。いずれも `:where()`(specificity 0) で prose/Tailwind を阻害せず、未対応ブラウザは従来挙動（プログレッシブエンハンスメント・新規依存なし）。
- **印刷 / PDF（`@media print`）**: 技術記事を紙/PDF で読む読者向けに本文を主役化。ヘッダー/フッター/目次(`nav[aria-label="目次"]`)/スキップリンクを `display:none`、OS がダークでも紙は `color-scheme:light`＋白地黒字に固定、`main` の幅/余白制約を解除、`pre/code` を `pre-wrap` で折り返し、本文中の外部リンク(`.prose a[href^="http"]`)に URL を `::after` で併記して参照先を辿れるようにする。すべて `@media print` 内＝画面表示に非干渉。

## デザイン参照（反復間で再利用）
| URL | 要点 | 適用箇所 |
|-----|------|---------|
| https://docs.astro.build/en/recipes/tailwind-rendered-markdown/ | prose一括整形・max-w-prose≈65ch | 本文読み幅 |
| https://www.adoc-studio.app/blog/typography-guide | 16px/行長60-75ch/行間1.5/左揃え/単一カラム | タイポ全般 |
| https://www.digitalsilk.com/digital-trends/minimalist-web-design-trends/ | 余白で階層・フォント2種まで | 美的指向/余白 |

<!-- ui-iterate パイロット iter1（2026-06-07）で確定（フェーズ⑥承認済）。 -->
<!-- iter2（2026-06-16）: 顔を「単調な一覧」→「ラボノートグリッド（鮮度＋分類）」に主題転換。grill-me 決定台帳 D1–D7 に基づく。
     確定: 二層構成(顔=ラボノート/本文=清潔リッチ不変)・カバー画像なし(依存ゼロ)・軽量タグ(同色チップ・機構なし)・
     影は顔のカードのみ限定解禁・鮮度は記事から自動導出(近況欄なし)・タグライン書換(検証の場)・サイト名据置。
     スコープ外: 記事本文/TOC/SEO/404/カバー自動生成/タグ別ページ/View Transitions。 -->
<!-- iter3（2026-06-30）: 色温度を温める（Zenn骨格は不変・note的な温さを足す）。「クール・技術寄り」に
     見せていた冷たい青アクセント＋中立グレーを温色へ。確定: --accent 青#2f5bd0/#6ea0ff → teal#3b7a6f/#6fb3a6・
     --bg light #fcfcfb→#fbfaf7（オフホワイト）・--border light #e6e7e3→#efeae2（ベージュ寄り）。
     BaseLayout の theme-color(light) も #fbfaf7 に同期。WCAG AA 維持を相対輝度で再計算（light accent/bg 4.79・dark 7.88）。
     スコープ外（不変）: 本文フォントサイズ(本文=清潔リッチ不変)・構造/タグ/TOC/SEO/404・dark bg。 -->
