export interface DeadlineInfo {
  formattedDateTime: string;
  timeRemainingText: string;
  isUrgent: boolean; // <= 24h or expired
  isExpired: boolean;
  colorClass: string; // text-emerald-500 or text-rose-500
  bgBadgeClass: string;
  fullBadgeText: string;
}

/**
 * Calculates deadline formatting and urgency colors:
 * - > 24 hours (> 1 day): Green (text-emerald-500, bg-emerald-500/10)
 * - <= 24 hours (under 24h) or expired: Red (text-rose-500, bg-rose-500/10)
 */
export function getDeadlineInfo(
  dueDate?: string | null,
  createdAt?: string | null
): DeadlineInfo {
  let targetDate: Date;

  if (dueDate && !isNaN(new Date(dueDate).getTime())) {
    targetDate = new Date(dueDate);
  } else if (createdAt && !isNaN(new Date(createdAt).getTime())) {
    targetDate = new Date(new Date(createdAt).getTime() + 7 * 24 * 60 * 60 * 1000);
  } else {
    targetDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  const formattedDateTime = targetDate.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const isExpired = diffMs <= 0;
  const isUrgent = diffHours <= 24; // <= 24h or expired

  let timeRemainingText = '';
  if (isExpired) {
    timeRemainingText = 'Đã hết hạn';
  } else if (diffHours < 1) {
    const mins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    timeRemainingText = `Còn ${mins} phút`;
  } else if (diffHours <= 24) {
    const hours = Math.floor(diffHours);
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    timeRemainingText = `Còn ${hours}h ${mins}p`;
  } else {
    const days = Math.ceil(diffHours / 24);
    timeRemainingText = `Còn ${days} ngày`;
  }

  // Color rules:
  // > 1 day: Green (Emerald)
  // <= 24h: Red (Rose)
  const colorClass = isUrgent || isExpired ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-500 dark:text-emerald-400';
  const bgBadgeClass = isUrgent || isExpired
    ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30'
    : 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/30';

  const fullBadgeText = `${formattedDateTime} (${timeRemainingText})`;

  return {
    formattedDateTime,
    timeRemainingText,
    isUrgent,
    isExpired,
    colorClass,
    bgBadgeClass,
    fullBadgeText,
  };
}
