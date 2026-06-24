import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { EMOJI_CATEGORIES } from '../data/emojiIcons';

interface Props {
  selected?: string;
  onChange: (icon: string | undefined) => void;
}

export default function IconPicker({ selected, onChange }: Props) {
  const [activeCat, setActiveCat] = useState(EMOJI_CATEGORIES[0].id);
  const category = EMOJI_CATEGORIES.find((c) => c.id === activeCat)!;
  const isKaomoji = activeCat === 'kaomoji';

  return (
    <View style={styles.wrap}>
      {/* Category tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsRow}
      >
        {EMOJI_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.tab, activeCat === cat.id && styles.tabActive]}
            onPress={() => setActiveCat(cat.id)}
          >
            <Text style={[styles.tabText, activeCat === cat.id && styles.tabTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Grid */}
      <View style={styles.grid}>
        {/* None/clear */}
        <TouchableOpacity
          style={[styles.emojiCell, !selected && styles.cellSelected]}
          onPress={() => onChange(undefined)}
        >
          <Text style={styles.noneText}>无</Text>
        </TouchableOpacity>

        {category.items.map((item) => {
          const active = selected === item;
          return (
            <TouchableOpacity
              key={item}
              style={[
                isKaomoji ? styles.kaomojiCell : styles.emojiCell,
                active && styles.cellSelected,
              ]}
              onPress={() => onChange(active ? undefined : item)}
              activeOpacity={0.7}
            >
              <Text style={isKaomoji ? styles.kaomojiText : styles.emojiText}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },

  tabsScroll: { marginHorizontal: -4 },
  tabsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 4, paddingBottom: 2 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#EDEEF2',
  },
  tabActive: { backgroundColor: '#111827' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  tabTextActive: { color: '#fff' },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiCell: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  kaomojiCell: {
    width: '47%',
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  cellSelected: {
    borderColor: '#111827',
    backgroundColor: '#F3F4F6',
  },
  emojiText: { fontSize: 28 },
  kaomojiText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 19,
  },
  noneText: { fontSize: 13, color: '#9CA3AF', fontWeight: '600' },
});
