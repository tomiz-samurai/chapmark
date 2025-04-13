/**
 * 日付操作のためのユーティリティ関数
 */

/**
 * 日付を YYYY/MM/DD 形式にフォーマットする
 */
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

/**
 * 日付を YYYY/MM/DD HH:MM 形式にフォーマットする
 */
export const formatDateTime = (date: Date | string | number): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

/**
 * 与えられた日付と現在の日付との相対的な時間差を返す
 * 例: "3分前", "2時間前", "昨日", "3日前", "2週間前", "1ヶ月前", "2年前"
 */
export const getRelativeTime = (date: Date | string | number): string => {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  // 1分未満
  if (diffSec < 60) {
    return 'たった今';
  }
  // 1時間未満
  if (diffMin < 60) {
    return `${diffMin}分前`;
  }
  // 24時間未満
  if (diffHour < 24) {
    return `${diffHour}時間前`;
  }
  // 昨日
  if (diffDay === 1) {
    return '昨日';
  }
  // 7日未満
  if (diffDay < 7) {
    return `${diffDay}日前`;
  }
  // 30日未満
  if (diffWeek < 4) {
    return `${diffWeek}週間前`;
  }
  // 12ヶ月未満
  if (diffMonth < 12) {
    return `${diffMonth}ヶ月前`;
  }
  // それ以上
  return `${diffYear}年前`;
}; 