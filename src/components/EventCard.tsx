import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CountdownEvent } from '../types';
import { formatDisplayDate, daysFromToday } from '../utils/dateUtils';
import { useCategoryStore } from '../store/categoryStore';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  event: CountdownEvent;
  onPress: () => void;
  onPinPress: () => void;
  onDelete?: () => void;
  onLongPress?: () => void;
}

export default function EventCard({ event, onPress, onPinPress, onDelete, onLongPress }: Props) {
  const diff = daysFromToday(event.targetDate);
  const isToday = diff === 0;
  const absDiff = Math.abs(diff);
  const color = event.themeColor;

  const { categories } = useCategoryStore();
  const { colors } = useTheme();
  const category = event.categoryId ? categories.find((c) => c.id === event.categoryId) : undefined;

  const unitLabel = isToday
    ? '天'
    : event.type === 'countdown'
    ? diff > 0 ? '天后' : '天前'
    : diff < 0 ? '天' : '天后';

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      {/* Accent bar */}
      <View style={[styles.accentBar, { backgroundColor: color }]} />

      {/* Main tappable area */}
      <Pressable
        style={styles.cardMain}
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={500}
        android_ripple={{ color: '#00000008', borderless: false }}
      >
        <View style={[styles.iconBadge, { backgroundColor: color + '1A' }]}>
          {event.icon ? (
            <Text
              style={event.icon.length > 2 ? styles.kaomojiText : styles.iconText}
              numberOfLines={event.icon.length > 2 ? 2 : 1}
            >
              {event.icon}
            </Text>
          ) : (
            <View style={[styles.iconDot, { backgroundColor: color }]} />
          )}
        </View>

        <View style={styles.middle}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{event.title}</Text>
          <View style={styles.subRow}>
            <Text style={[styles.date, { color: colors.textMuted }]}>{formatDisplayDate(event.targetDate)}</Text>
            {category && (
              <View style={[styles.catBadge, { backgroundColor: category.color + '1A' }]}>
                <Text style={[styles.catText, { color: category.color }]}>{category.label}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.right}>
          <Text
            style={[styles.number, { color }]}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {isToday ? '今' : absDiff.toString()}
          </Text>
          <Text style={[styles.unit, { color: color + 'AA' }]}>{unitLabel}</Text>
        </View>
      </Pressable>

      {/* Action buttons */}
      <View style={styles.actions}>
        <Pressable
          onPress={onPinPress}
          hitSlop={12}
          android_ripple={{ color: '#00000011', radius: 18 }}
        >
          <View style={[styles.pinWrap, event.pinned && { backgroundColor: color + '22' }]}>
            <Ionicons
              name={event.pinned ? 'pin' : 'pin-outline'}
              size={22}
              color={event.pinned ? color : colors.textPlaceholder}
            />
          </View>
        </Pressable>
        <Pressable
          onPress={onDelete}
          hitSlop={12}
          android_ripple={{ color: '#F8717133', radius: 16 }}
        >
          <Ionicons name="trash-outline" size={15} color="#F87171" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  cardMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 72,
    height: 56,
    borderRadius: 16,
    margin: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    paddingHorizontal: 6,
  },
  iconText: { fontSize: 26, textAlign: 'center' },
  kaomojiText: { fontSize: 13, lineHeight: 18, textAlign: 'center' },
  iconDot: { width: 18, height: 18, borderRadius: 9 },
  middle: {
    flex: 1,
    paddingVertical: 14,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  date: { fontSize: 12 },
  catBadge: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  catText: { fontSize: 10, fontWeight: '600' },
  right: {
    alignItems: 'flex-end',
    minWidth: 52,
    marginLeft: 8,
    marginRight: 4,
  },
  number: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 40,
    textAlign: 'right',
  },
  unit: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  actions: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 12,
    alignSelf: 'stretch',
  },
  pinWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
