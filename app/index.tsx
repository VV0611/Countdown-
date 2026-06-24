import React, { useMemo, useState } from 'react';
import {
  View, FlatList, TouchableOpacity, StyleSheet, Alert,
  TextInput, ScrollView, Text,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEventStore } from '../src/store/eventStore';
import { useCategoryStore } from '../src/store/categoryStore';
import EventCard from '../src/components/EventCard';
import EmptyState from '../src/components/EmptyState';
import { sortKey } from '../src/utils/dateUtils';
import { useTheme } from '../src/theme/ThemeContext';

export default function HomeScreen() {
  const router = useRouter();
  const { events, togglePin, remove } = useEventStore();
  const { categories } = useCategoryStore();
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  function confirmDelete(id: string, title: string) {
    Alert.alert('删除活动', `确定删除「${title}」？`, [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => remove(id) },
    ]);
  }

  const sorted = useMemo(() => {
    let filtered = events;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((e) => e.title.toLowerCase().includes(q));
    }
    if (activeCategoryId) {
      filtered = filtered.filter((e) => e.categoryId === activeCategoryId);
    }
    const pinned = filtered.filter((e) => e.pinned).sort((a, b) => sortKey(a.targetDate) - sortKey(b.targetDate));
    const rest = filtered.filter((e) => !e.pinned).sort((a, b) => sortKey(a.targetDate) - sortKey(b.targetDate));
    return [...pinned, ...rest];
  }, [events, searchQuery, activeCategoryId]);

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
        {/* Search bar */}
        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <Ionicons name="search-outline" size={17} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="搜索活动名称…"
            placeholderTextColor={colors.textPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={17} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}
        >
          <TouchableOpacity
            style={[styles.chip, { backgroundColor: colors.pillBg }, !activeCategoryId && styles.chipActive]}
            onPress={() => setActiveCategoryId(null)}
          >
            <Text style={[styles.chipText, { color: colors.textMuted }, !activeCategoryId && styles.chipTextActive]}>
              全部
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => {
            const active = activeCategoryId === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.chip,
                  { backgroundColor: colors.pillBg },
                  active && { backgroundColor: cat.color, borderColor: cat.color },
                ]}
                onPress={() => setActiveCategoryId(active ? null : cat.id)}
              >
                <View style={[styles.chipDot, { backgroundColor: active ? '#fff' : cat.color }]} />
                <Text style={[styles.chipText, { color: colors.textMuted }, active && { color: '#fff' }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

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
  list: { paddingTop: 8, paddingBottom: 48 },
  emptyList: { flex: 1 },
  addBtn: { marginRight: 4 },
  settingsBtn: { marginLeft: 4 },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },

  chipScroll: { flexGrow: 0 },
  chipRow: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipActive: { backgroundColor: '#111827', borderColor: '#111827' },
  chipText: { fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  chipDot: { width: 7, height: 7, borderRadius: 3.5 },
});
