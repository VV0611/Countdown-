import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { useEventStore } from '../../src/store/eventStore';
import EventForm from '../../src/components/EventForm';
import { CountdownEvent } from '../../src/types';
import { scheduleReminder } from '../../src/utils/notificationUtils';

type FormData = Omit<CountdownEvent, 'id' | 'createdAt'>;

export default function NewEventScreen() {
  const router = useRouter();
  const add = useEventStore((s) => s.add);

  async function handleSubmit(data: FormData) {
    let notificationId: string | undefined;
    if (data.reminder && data.reminder !== 'none') {
      const nid = await scheduleReminder(data.title, data.targetDate, parseInt(data.reminder));
      notificationId = nid ?? undefined;
    }
    add({ ...data, notificationId });
    router.replace('/');
  }

  return (
    <>
      <Stack.Screen options={{ title: '新建活动' }} />
      <EventForm onSubmit={handleSubmit} />
    </>
  );
}
