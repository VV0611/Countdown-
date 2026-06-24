import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEventStore } from '../../../src/store/eventStore';
import EventForm from '../../../src/components/EventForm';
import { CountdownEvent } from '../../../src/types';
import { scheduleReminder, cancelReminder } from '../../../src/utils/notificationUtils';

type FormData = Omit<CountdownEvent, 'id' | 'createdAt'>;

export default function EditEventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { events, update, remove } = useEventStore();
  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <>
        <Stack.Screen options={{ title: '编辑活动' }} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Event not found.</Text>
        </View>
      </>
    );
  }

  async function handleSubmit(data: FormData) {
    if (!event) return;
    if (event.notificationId) await cancelReminder(event.notificationId);
    let notificationId: string | undefined;
    if (data.reminder && data.reminder !== 'none') {
      const nid = await scheduleReminder(data.title, data.targetDate, parseInt(data.reminder));
      notificationId = nid ?? undefined;
    }
    update(id, { ...data, notificationId });
    router.replace('/');
  }

  async function handleDelete() {
    if (!event) return;
    if (event.notificationId) await cancelReminder(event.notificationId);
    remove(id);
    router.replace('/');
  }

  return (
    <>
      <Stack.Screen options={{ title: '编辑活动' }} />
      <EventForm
        initialData={event}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </>
  );
}

const styles = StyleSheet.create({
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { color: '#9CA3AF', fontSize: 15 },
});
