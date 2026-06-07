# tech-blog

公開技術ブログ（Astro 静的サイト / content-first SSG）。

## 役割

- **公開**を前提とした技術ブログ。記事の**正本は Markdown**（`src/content/articles/*.md`）。
- 1 ページ 1 記事・独立 URL・zero-JS で配信する。
- frontmatter は `src/content.config.ts` の **Zod strict スキーマ**で検証する。
  個人情報・健康フィールドは**定義しない**ため、混入するとビルドが失敗する（安全弁）。

## 構成

```
package.json            Astro 依存・dev/build/preview scripts（"type":"module"）
astro.config.mjs        最小設定・output: static
tsconfig.json           astro/tsconfigs/strict 継承
src/
  content.config.ts     Content Collections + Zod スキーマ（title/description/publishedAt/sources）
  content/articles/     記事 Markdown 置き場（現在は空）
  layouts/BaseLayout.astro   SEO メタ・UTF-8・zero-JS
  pages/
    index.astro              記事一覧（1 タップ遷移）
    articles/[...slug].astro  1 ページ 1 記事
.github/workflows/safety-gate.yml  Gitleaks による秘密/PII ゲート
.gitleaks.toml          デフォルトルール + 日本語 健康/PII denylist
```

## Astro バージョン

`package.json` は `astro` をメジャー指定している。**正確な最新安定版は初回 `npm install` 時に確認**し、必要なら更新すること（このディレクトリでは install / build は未実行）。

## git 衛生規約（最重要）

このリポジトリは公開される。private(life-data)由来の wip・健康ログ・個人情報を**履歴ごと**持ち込まないため、以下を厳守する。

- **空履歴から開始**する（`git init` を新規に行い、他リポジトリの履歴を引き継がない）。
- **clean 版のみコミット**する。生 wip・下書き・ログをそのまま入れない。
- **squash 運用**で履歴を平坦化し、中間の混入が履歴に残らないようにする。
- **コミットメッセージに life-data 由来の文言を持ち込まない**（気分ログ・健康語彙・個人名を含めない）。
- **公開は人間承認必須**。自動公開（自動デプロイ）はしない。
- private(life-data)の wip から記事を移送するときは、**明示コピー＋差分の目視確認**を経てから `src/content/articles/` に置く（丸ごと同期しない）。

## 安全ゲート（CI）

- push / PR ごとに `.github/workflows/safety-gate.yml` が **Gitleaks** を実行する。
- Gitleaks は frontmatter だけでなく **Markdown 本文(body)** も走査する。
- 秘密・PII・健康語彙を検出した場合は**ジョブを失敗**させ、マージ/公開を止める。
- 誤検知の許可（allowlist）には**根拠コメントと TTL（失効日）を必須**とする（`.gitleaks.toml` 参照）。

## セットアップ（後続・人間が実施）

このディレクトリは**ファイルのみ**用意した状態。以下は**未実施**であり、人間の確認後に別途行う。

- `git init` / remote 追加 / `gh repo create` / push
- `npm install` / `npm run build`
- Vercel 等へのデプロイ設定 / secrets 設定
