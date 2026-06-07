// 読了時間の概算（ビルド時のみ・zero-JS / 新規依存なし）。
//
// 日本語主体の本文を前提に「文字数 ÷ 1分あたりの読字数」で概算する。
// 英語の語数ベースにしないのは、日本語は単語間にスペースが無く語数カウントが
// 破綻するため。日本語の黙読速度は概ね 400–600 字/分とされるので、中間値の
// 500 字/分を採用する。コードブロック等の記法は散文ではないため除外して数える。
const CHARS_PER_MINUTE = 500;

export function readingTimeMin(markdown: string): number {
  const text = markdown
    // フェンス付きコードブロックを除去（読了の主対象は散文）
    .replace(/```[\s\S]*?```/g, '')
    // インラインコードを除去
    .replace(/`[^`]*`/g, '')
    // 画像・リンクは表示テキストだけ残す
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    // 見出し/引用/リスト等の行頭マーカーを除去
    .replace(/^[#>\-*+\s]+/gm, '')
    // 残りの空白を除いて文字数を数える
    .replace(/\s+/g, '');
  return Math.max(1, Math.round(text.length / CHARS_PER_MINUTE));
}
