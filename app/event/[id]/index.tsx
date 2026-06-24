import { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, Alert, Modal, ImageBackground,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEventStore } from '../../../src/store/eventStore';
import { daysFromToday, formatDisplayDate } from '../../../src/utils/dateUtils';
import { parseBg } from '../../../src/utils/backgroundUtils';
import ShareCard from '../../../src/components/ShareCard';
import { useTheme } from '../../../src/theme/ThemeContext';

export default function EventSimpleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { events } = useEventStore();
  const event = events.find((e) => e.id === id);
  const [shareVisible, setShareVisible] = useState(false);
  const cardRef = useRef<View>(null);
  const { colors } = useTheme();

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
  const bg = parseBg(event.coverImage);
  const color = event.themeColor;

  const heroLabel = isToday
    ? '就是今天'
    : isPast
    ? event.type === 'countup' ? '在一起已经' : '已过去'
    : '还有';

  const handleShare = async () => {
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
      Alert.alert('出错了', '生成分享图片失败');
    }
  };

  const handleSaveImage = async () => {
    if (Platform.OS === 'web') return;
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
      Alert.alert('出错了', '保存图片失败');
    }
  };

  // Background
  let bgEl: React.ReactNode;
  if (bg.type === 'gradient') {
    bgEl = (
      <LinearGradient
        colors={bg.preset.colors as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    );
  } else if (bg.type === 'image') {
    bgEl = (
      <ImageBackground
        source={{ uri: bg.uri }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
    );
  } else {
    bgEl = <View style={[StyleSheet.absoluteFill, { backgroundColor: '#F5F5F0' }]} />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: event.title,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push(`/event/${id}/detail`)}
              style={styles.headerBtn}
            >
              <Ionicons name="reader-outline" size={22} color={color} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.screen}>
        {bgEl}

        {/* Card */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            {/* Colored label header */}
            <View style={[styles.cardHeader, { backgroundColor: color }]}>
              <Text style={styles.heroLabel}>{heroLabel}</Text>
            </View>

            {/* White body */}
            <View style={[styles.cardBody, { backgroundColor: colors.surface }]}>
              {isToday ? (
                <>
                  <Text style={styles.todayEmoji}>🎉</Text>
                  <Text style={[styles.todayText, { color }]}>就是今天！</Text>
                </>
              ) : (
                <View style={styles.numberRow}>
                  <Text style={[styles.bigNumber, { color: colors.text }]}>{absDiff}</Text>
                  <Text style={[styles.bigUnit, { color }]}>天</Text>
                </View>
              )}
              <Text style={styles.dateText}>
                目标日：{formatDisplayDate(event.targetDate)}
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom action bar */}
        <View style={[styles.bottomBar, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setShareVisible(true)}
            activeOpacity={0.75}
          >
            <Ionicons name="share-outline" size={22} color="#555" />
            <Text style={styles.actionLabel}>分享</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleSaveImage}
            activeOpacity={0.75}
          >
            <Ionicons name="download-outline" size={22} color="#555" />
            <Text style={styles.actionLabel}>保存图片</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push(`/event/${id}/edit`)}
            activeOpacity={0.75}
          >
            <Ionicons name="create-outline" size={22} color="#555" />
            <Text style={styles.actionLabel}>编辑</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push(`/event/${id}/detail`)}
            activeOpacity={0.75}
          >
            <Ionicons name="reader-outline" size={22} color={color} />
            <Text style={[styles.actionLabel, { color }]}>详情</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ShareCard rendered outside Modal so cardRef is always mounted */}
      <View style={styles.hiddenCard} pointerEvents="none">
        <View ref={cardRef} collapsable={false}>
          <ShareCard event={event} />
        </View>
      </View>

      <Modal
        visible={shareVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setShareVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: colors.modalBg }]}>
            <Text style={styles.modalTitle}>分享卡片</Text>
            <ShareCard event={event} />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShareVisible(false)}>
                <Text style={styles.cancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { borderColor: color }]}
                onPress={handleSaveImage}
              >
                <Ionicons name="download-outline" size={18} color={color} />
                <Text style={[styles.saveBtnText, { color }]}>保存</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.shareBtn, { backgroundColor: color }]}
                onPress={handleShare}
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

const styles = StyleSheet.create({
  screen: { flex: 1 },
  hiddenCard: { position: 'absolute', opacity: 0, left: -9999 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { color: '#9CA3AF', fontSize: 15 },
  headerBtn: { marginRight: 4 },

  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 20,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  heroLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  cardBody: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 36,
    alignItems: 'center',
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  bigNumber: {
    fontSize: 96,
    fontWeight: '800',
    color: '#1F2937',
    lineHeight: 102,
  },
  bigUnit: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 14,
  },
  todayEmoji: { fontSize: 60, lineHeight: 68 },
  todayText: { fontSize: 24, fontWeight: '800', marginTop: 8 },
  dateText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 20,
  },

  // Bottom bar
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.08)',
    paddingBottom: 28,
    paddingTop: 4,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  actionLabel: {
    fontSize: 11,
    color: '#555',
    fontWeight: '500',
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },

  // Modal
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
