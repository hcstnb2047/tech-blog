// 日付整形ユーティリティ（ビルド時のみ・zero-JS）。
//
// YYYY-MM-DD のカレンダー日付を日本語表記（例: "2026年6月7日"）に整形する。
// あえて `new Date()` / `toLocaleDateString` を介さず文字列分解で組み立てる:
//   - `new Date('2026-06-07')` は UTC 00:00 として解釈されるため、ビルド環境の
//     タイムゾーン次第で「前日」に表示ズレし得る。文字列分解なら決定的でズレない。
//   - content schema 側で `z.string().date()`（YYYY-MM-DD）を保証済みなので、
//     入力フォーマットは固定とみなせる。
export function formatDateJa(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${year}年${Number(month)}月${Number(day)}日`;
}
