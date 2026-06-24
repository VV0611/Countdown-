import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleReminder(
  title: string,
  targetDate: string,
  daysBefore: number,
): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  try {
    const trigger = new Date(targetDate + 'T09:00:00');
    trigger.setDate(trigger.getDate() - daysBefore);
    if (trigger <= new Date()) return null;

    const notifTitle = daysBefore === 0
      ? `今天是「${title}」！`
      : `「${title}」提醒`;
    const body = daysBefore === 0
      ? '🎉 期待已久的日子终于到了！'
      : `📅 还有 ${daysBefore} 天，提前做好准备吧`;

    return await Notifications.scheduleNotificationAsync({
      content: { title: notifTitle, body },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: trigger },
    });
  } catch {
    return null;
  }
}

export async function cancelReminder(notificationId: string): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {}
}
