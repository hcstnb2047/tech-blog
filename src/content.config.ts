import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// =============================================================================
// Content Collections + Zod スキーマ（公開技術ブログ）
//
// 設計意図（安全弁）:
//   - このスキーマは「公開してよいフィールドだけ」を定義する allowlist である。
//   - 個人情報・健康情報のフィールド（例: mood, m/d, 通院, 投薬, 診断, 本名 等）は
//     【意図的に一切定義しない】。frontmatter にそれらが混入した場合、未知キーは
//     Zod が拒否し、ビルドが失敗する＝公開前に止まる安全弁として機能させる。
//   - 同様に CI 側（Gitleaks）が本文(Markdown body)も含めて PII/健康語彙を走査する。
//     スキーマ（frontmatter）と Gitleaks（本文）の二段構えで防御する。
// =============================================================================

const articles = defineCollection({
  // Markdown 記事を src/content/articles/ から読み込む（記事はまだ無し）。
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.strictObject({
    // SEO・表示に必須のメタ。
    title: z.string(),
    // SEO メタ必須（description タグに使用）。
    description: z.string(),
    // 公開日（YYYY-MM-DD のカレンダー日付）。
    publishedAt: z.string().date(),
    // 出典必須: 1件以上の {title, url} を要求する（無出典の公開を防ぐ）。
    sources: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
        })
      )
      .min(1),
  }),
});

export const collections = { articles };
