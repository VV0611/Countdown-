import React, { useMemo } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEventStore } from '../src/store/eventStore';
import EventCard from '../src/components/EventCard';
import EmptyState from '../src/components/EmptyState';
import { sortKey } from '../src/utils/dateUtils';

export default function HomeScreen() {
  const router = useRouter();
  const { events, togglePin, remove } = useEventStore();

  function confirmDelete(id: string, title: string) {
    Alert.alert('删除活动', `确定删除「${title}」？`, [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => remove(id) },
    ]);
  }

  const sorted = useMemo(() => {
    const pinned = events.filter((e) => e.pinned).sort((a, b) => sortKey(a.targetDate) - sortKey(b.targetDate));
    const rest = events.filter((e) => !e.pinned).sort((a, b) => sortKey(a.targetDate) - sortKey(b.targetDate));
    return [...pinned, ...rest];
  }, [events]);

  return (
    <>
      <Stack.Screen
        options={{
          title: '倒数日',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push('/settings')} style={styles.settingsBtn}>
              <Ionicons name="settings-outline" size={22} color="#5B8DEF" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/event/new')} style={styles.addBtn}>
              <Ionicons name="add" size={28} color="#5B8DEF" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => router.push(`/event/${item.id}`)}
              onPinPress={() => togglePin(item.id)}
              onDelete={() => confirmDelete(item.id, item.title)}
              onLongPress={() => confirmDelete(item.id, item.title)}
            />
          )}
          ListEmptyComponent={<EmptyState />}
          contentContainerStyle={sorted.length === 0 ? styles.emptyList : styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingTop: 12, paddingBottom: 48 },
  emptyList: { flex: 1 },
  addBtn: { marginRight: 4 },
  settingsBtn: { marginLeft: 4 },
});
