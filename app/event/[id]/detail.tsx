import { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, Platform, Alert, ImageBackground,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import dayjs from 'dayjs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEventStore } from '../../../src/store/eventStore';
import { daysFromToday, formatDisplayDate } from '../../../src/utils/dateUtils';
import { getMilestoneInfo } from '../../../src/utils/milestoneUtils';
import { parseBg } from '../../../src/utils/backgroundUtils';
import ShareCard from '../../../src/components/ShareCard';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { events, togglePin } = useEventStore();
  const event = events.find((e) => e.id === id);

  const [now, setNow] = useState(() => new Date());
  const [shareVisible, setShareVisible] = useState(false);
  const cardRef = useRef<View>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!event) {
    return (
      <>
        <Stack.Screen options={{ title: 'Detail' }} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Event not found.</Text>
        </View>
      </>
    );
  }

  const diff = daysFromToday(event.targetDate);
  const absDiff = Math.abs(diff);
  const isPast = diff < 0;
  const isToday = diff === 0;
  const milestone = getMilestoneInfo(absDiff);
  const bg = parseBg(event.coverImage);

  const weeks = Math.floor(absDiff / 7);
  const daysAfterWeeks = absDiff % 7;

  const targetDay = dayjs(event.targetDate).startOf('day');
  const todayDay = dayjs().startOf('day');
  const months = Math.abs(targetDay.diff(todayDay, 'month'));
  const pivotDate = isPast
    ? targetDay.add(months, 'month')
    : todayDay.add(months, 'month');
  const daysAfterMonths = Math.abs(targetDay.diff(pivotDate, 'day'));

  const years = Math.floor(absDiff / 365);
  const daysAfterYears = absDiff - years * 365;

  const totalSecondsRaw = targetDay.diff(dayjs(now), 'second');
  const intradaySeconds = Math.abs(totalSecondsRaw) % 86400;
  const hh = String(Math.floor(intradaySeconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((intradaySeconds % 3600) / 60)).padStart(2, '0');
  const ss = String(intradaySeconds % 60).padStart(2, '0');
  const preciseStr = isToday ? `${hh}:${mm}:${ss}` : `${absDiff} 天  ${hh}:${mm}:${ss}`;

  const heroLabel = isToday ? null : isPast ? '已过去' : '还有';
  const typeLabel = event.type === 'countdown' ? '倒数日' : '计日';

  const handleShareCard = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('提示', '分享功能仅支持移动端');
      return;
    }
    try {
      const { captureRef } = await import('react-native-view-shot');
      const uri = await captureRef(cardRef, { format: 'png', quality: 1 });
      const Sharing = await import('expo-sharing');
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert('提示', '当前设备不支持分享');
        return;
      }
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: '分享事件卡片' });
    } catch {
      Alert.alert('出错了', '生成分享图片失败，请重试');
    }
  };

  const handleSaveImage = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('提示', '保存功能仅支持移动端');
      return;
    }
    try {
      const MediaLibrary = await import('expo-media-library');
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('需要权限', '请在设置中允许访问相册');
        return;
      }
      const { captureRef } = await import('react-native-view-shot');
      const uri = await captureRef(cardRef, { format: 'png', quality: 1 });
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('倒数日', asset, false);
      Alert.alert('已保存', '图片已保存到相册');
    } catch {
      Alert.alert('出错了', '保存图片失败，请重试');
    }
  };

  const heroContent = (
    <View style={styles.heroContent}>
      {milestone?.status === 'at' && (
        <View style={styles.milestoneBanner}>
          <Text style={styles.milestoneBannerText}>🎉 第 {milestone.value} 天里程碑！</Text>
        </View>
      )}
      {milestone?.status === 'approaching' && (
        <View style={[styles.milestoneBanner, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
          <Text style={styles.milestoneBannerText}>
            ⏳ 再 {milestone.daysTo} 天到达 {milestone.value} 天
          </Text>
        </View>
      )}

      {event.icon ? (
        <View style={styles.heroIconWrap}>
          <Text
            style={event.icon.length > 2 ? styles.heroIconKaomoji : styles.heroIcon}
            numberOfLines={event.icon.length > 2 ? 2 : 1}
          >
            {event.icon}
          </Text>
        </View>
      ) : null}

      <Text style={styles.heroTitle}>{event.title}</Text>

      {heroLabel ? (
        <Text style={styles.heroLabel}>{heroLabel}</Text>
      ) : null}

      {isToday ? (
        <>
          <Text style={styles.todayEmoji}>🎉</Text>
          <Text style={styles.todayText}>就是今天！</Text>
        </>
      ) : (
        <View style={styles.numberRow}>
          <Text style={styles.bigNumber} adjustsFontSizeToFit numberOfLines={1}>
            {absDiff}
          </Text>
          <Text style={styles.bigUnit}>天</Text>
        </View>
      )}

      <Text style={styles.heroDate}>{formatDisplayDate(event.targetDate)}</Text>
    </View>
  );

  let heroEl: React.ReactNode;
  if (bg.type === 'gradient') {
    heroEl = (
      <LinearGradient
        colors={bg.preset.colors as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        {heroContent}
      </LinearGradient>
    );
  } else if (bg.type === 'image') {
    heroEl = (
      <ImageBackground
        source={{ uri: bg.uri }}
        style={styles.hero}
        imageStyle={styles.heroImageStyle}
      >
        <View style={styles.heroImageOverlay} />
        {heroContent}
      </ImageBackground>
    );
  } else {
    heroEl = (
      <View style={[styles.hero, { backgroundColor: event.themeColor }]}>
        {heroContent}
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: event.title }} />

      <View style={styles.screen}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {heroEl}

          {!isToday && (
            <View style={styles.section}>
              <UnitRow
                icon="time-outline"
                label="精确到秒"
                value={preciseStr}
                accent
                color={event.themeColor}
              />
              <Divider />
              <UnitRow
                icon="calendar-outline"
                label="换算成周"
                value={weeks > 0 ? `${weeks} 周${daysAfterWeeks > 0 ? ` ${daysAfterWeeks} 天` : ''}` : `${daysAfterWeeks} 天`}
              />
              <Divider />
              <UnitRow
                icon="calendar-number-outline"
                label="换算成月"
                value={months > 0 ? `约 ${months} 个月${daysAfterMonths > 0 ? ` ${daysAfterMonths} 天` : ''}` : `${daysAfterMonths} 天`}
              />
              {years >= 1 && (
                <>
                  <Divider />
                  <UnitRow
                    icon="planet-outline"
                    label="换算成年"
                    value={`${years} 年${daysAfterYears > 0 ? ` ${daysAfterYears} 天` : ''}`}
                  />
                </>
              )}
            </View>
          )}

          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: event.themeColor + '22' }]}>
              <Text style={[styles.badgeText, { color: event.themeColor }]}>{typeLabel}</Text>
            </View>
            {event.pinned && (
              <View style={[styles.badge, { backgroundColor: '#FBBF2420' }]}>
                <Text style={[styles.badgeText, { color: '#D97706' }]}>📌 已置顶</Text>
              </View>
            )}
          </View>

          {event.note ? (
            <View style={styles.noteBox}>
              <Text style={styles.noteText}>{event.note}</Text>
            </View>
          ) : null}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom action bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setShareVisible(true)}>
            <View style={[styles.actionIcon, { backgroundColor: event.themeColor + '18' }]}>
              <Ionicons name="share-outline" size={22} color={event.themeColor} />
            </View>
            <Text style={[styles.actionLabel, { color: event.themeColor }]}>分享</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push(`/event/${id}/edit`)}
          >
            <View style={[styles.actionIcon, { backgroundColor: event.themeColor + '18' }]}>
              <Ionicons name="pencil-outline" size={22} color={event.themeColor} />
            </View>
            <Text style={[styles.actionLabel, { color: event.themeColor }]}>编辑</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => togglePin(event.id)}>
            <View style={[styles.actionIcon, { backgroundColor: event.themeColor + '18' }]}>
              <Ionicons
                name={event.pinned ? 'pin' : 'pin-outline'}
                size={22}
                color={event.themeColor}
              />
            </View>
            <Text style={[styles.actionLabel, { color: event.themeColor }]}>
              {event.pinned ? '取消置顶' : '置顶'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={shareVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setShareVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>分享卡片</Text>
            <View ref={cardRef} collapsable={false}>
              <ShareCard event={event} />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShareVisible(false)}
              >
                <Text style={styles.cancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { borderColor: event.themeColor }]}
                onPress={handleSaveImage}
              >
                <Ionicons name="download-outline" size={18} color={event.themeColor} />
                <Text style={[styles.saveBtnText, { color: event.themeColor }]}>保存</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.shareBtn, { backgroundColor: event.themeColor }]}
                onPress={handleShareCard}
              >
                <Ionicons name="share-outline" size={18} color="#fff" />
                <Text style={styles.shareBtnText}>分享</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function UnitRow({
  icon, label, value, accent, color,
}: {
  icon: string; label: string; value: string; accent?: boolean; color?: string;
}) {
  return (
    <View style={styles.unitRow}>
      <Ionicons
        name={icon as any}
        size={18}
        color={accent && color ? color : '#9CA3AF'}
        style={styles.unitIcon}
      />
      <Text style={styles.unitLabel}>{label}</Text>
      <Text style={[styles.unitValue, accent && color ? { color } : null]}>
        {value}
      </Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { flex: 1 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { color: '#9CA3AF', fontSize: 15 },

  // Hero
  hero: {
    paddingTop: 40,
    paddingBottom: 52,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
  },
  heroContent: { alignItems: 'center', width: '100%' },
  heroImageStyle: { borderBottomLeftRadius: 36, borderBottomRightRadius: 36 },
  heroImageOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.42)',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  milestoneBanner: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 18,
  },
  milestoneBannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  heroIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroIcon: { fontSize: 38, lineHeight: 44 },
  heroIconKaomoji: { fontSize: 16, lineHeight: 22, textAlign: 'center' },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
  },
  heroLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 2,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginVertical: 6,
  },
  bigNumber: {
    fontSize: 96,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 104,
    maxWidth: 240,
  },
  bigUnit: {
    fontSize: 32,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
  },
  todayEmoji: { fontSize: 72, lineHeight: 80, marginVertical: 6 },
  todayText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  heroDate: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.68)',
    marginTop: 10,
  },

  // Conversions
  section: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  unitIcon: { marginRight: 10 },
  unitLabel: { flex: 1, fontSize: 14, color: '#6B7280' },
  unitValue: { fontSize: 15, fontWeight: '700', color: '#111' },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#F3F4F6',
    marginLeft: 44,
  },

  // Meta
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: { fontSize: 13, fontWeight: '600' },

  // Note
  noteBox: {
    margin: 16,
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
  },
  noteText: { fontSize: 14, color: '#374151', lineHeight: 20 },

  // Bottom bar
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Share modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelText: { fontSize: 15, color: '#6B7280', fontWeight: '600' },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  saveBtnText: { fontSize: 15, fontWeight: '700' },
  shareBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  shareBtnText: { fontSize: 15, color: '#fff', fontWeight: '700' },
});
