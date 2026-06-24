import dayjs from 'dayjs';

// Returns positive = days remaining, negative = days past, 0 = today
export function daysFromToday(targetDate: string): number {
  const today = dayjs().startOf('day');
  const target = dayjs(targetDate).startOf('day');
  return target.diff(today, 'day');
}

// Human-readable label for the card
export function getDayLabel(event: { type: 'countdown' | 'countup'; targetDate: string }): string {
  const diff = daysFromToday(event.targetDate);

  if (diff === 0) return 'Today';

  if (event.type === 'countdown') {
    if (diff > 0) return `${diff} days left`;
    return `${Math.abs(diff)} days ago`;
  } else {
    // countup: "已经 N 天"
    if (diff < 0) return `${Math.abs(diff)} days since`;
    return `${diff} days until`;
  }
}

export function formatDisplayDate(dateStr: string): string {
  return dayjs(dateStr).format('MMM D, YYYY');
}

// Sort key: distance from today (ascending), 0 = today
export function sortKey(targetDate: string): number {
  return Math.abs(daysFromToday(targetDate));
}
