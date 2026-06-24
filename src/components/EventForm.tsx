import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { CountdownEvent, EventType, RepeatType, REPEAT_LABELS, DEFAULT_COLOR } from '../types';
import BackgroundPicker from './BackgroundPicker';
import IconPicker from './IconPicker';
import ConfirmDialog from './ConfirmDialog';
import { parseBg } from '../utils/backgroundUtils';
import { LinearGradient } from 'expo-linear-gradient';
import { useCategoryStore } from '../store/categoryStore';
import { Ionicons } from '@expo/vector-icons';

type FormData = Omit<CountdownEvent, 'id' | 'createdAt'>;

interface Props {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
  onDelete?: () => void;
}

export default function EventForm({ initialData, onSubmit, onDelete }: Props) {
  const router = useRouter();
  const { categories } = useCategoryStore();

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [targetDate, setTargetDate] = useState<Date>(
    initialData?.targetDate ? new Date(initialData.targetDate) : new Date()
  );
  const [type, setType] = useState<EventType>(initialData?.type ?? 'countdown');
  const [repeat, setRepeat] = useState<RepeatType>(initialData?.repeat ?? 'none');
  const [themeColor, setThemeColor] = useState(initialData?.themeColor ?? DEFAULT_COLOR);
  const [coverImage, setCoverImage] = useState<string | undefined>(initialData?.coverImage);
  const [icon, setIcon] = useState<string | undefined>(initialData?.icon);
  const [categoryId, setCategoryId] = useState<string | undefined>(initialData?.categoryId);
  const [note, setNote] = useState<string | undefined>(initialData?.note);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [titleError, setTitleError] = useState(false);

  function handleSubmit() {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }
    onSubmit({
      title: title.trim(),
      targetDate: dayjs(targetDate).format('YYYY-MM-DD'),
      type,
      repeat,
      themeColor,
      coverImage,
      icon,
      categoryId,
      note: note?.trim() || undefined,
      isLunar: false,
      pinned: initialData?.pinned ?? false,
    });
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Title */}
      <View style={styles.section}>
        <Text style={styles.label}>活动名称</Text>
        <TextInput
          style={[styles.input, titleError && styles.inputError]}
          placeholder="例：暑假旅行"
          placeholderTextColor="#C4C9D4"
          value={title}
          onChangeText={(t) => { setTitle(t); setTitleError(false); }}
          maxLength={40}
        />
        {titleError && <Text style={styles.errorText}>请填写活动名称</Text>}
      </View>

      {/* Date */}
      <View style={styles.section}>
        <Text style={styles.label}>目标日期</Text>
        {Platform.OS === 'web' ? (
          <input
            type="date"
            value={dayjs(targetDate).format('YYYY-MM-DD')}
            onChange={(e) => {
              if (e.target.value) setTargetDate(new Date(e.target.value + 'T00:00:00'));
            }}
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              border: '1px solid #E5E7EB',
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 15,
              paddingBottom: 15,
              fontSize: 16,
              color: '#111827',
              width: '100%',
              boxSizing: 'border-box' as const,
              outline: 'none',
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          />
        ) : (
          <>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateButtonText}>{dayjs(targetDate).format('YYYY年M月D日')}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={targetDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(_, date) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (date) setTargetDate(date);
                }}
              />
            )}
          </>
        )}
      </View>

      {/* Type */}
      <View style={styles.section}>
        <Text style={styles.label}>计时类型</Text>
        <View style={styles.segmentRow}>
          {(['countdown', 'countup'] as EventType[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.segment, type === t && { backgroundColor: themeColor }]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.segmentText, type === t && styles.segmentTextActive]}>
                {t === 'countdown' ? '倒计时' : '正计时'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Repeat */}
      <View style={styles.section}>
        <Text style={styles.label}>重复提醒</Text>
        <View style={styles.segmentRow}>
          {(['none', 'weekly', 'monthly', 'yearly'] as RepeatType[]).map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.segment, repeat === r && { backgroundColor: themeColor }]}
              onPress={() => setRepeat(r)}
            >
              <Text style={[styles.segmentText, repeat === r && styles.segmentTextActive]}>
                {REPEAT_LABELS[r]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Category */}
      <View style={styles.section}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>分类</Text>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.manageCatBtn}>
            <Ionicons name="settings-outline" size={14} color="#9CA3AF" />
            <Text style={styles.manageCatText}>管理分类</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.catPillRow}>
            <TouchableOpacity
              style={[styles.catPill, !categoryId && styles.catPillSelected]}
              onPress={() => setCategoryId(undefined)}
            >
              <Text style={[styles.catPillText, !categoryId && styles.catPillTextSelected]}>无</Text>
            </TouchableOpacity>
            {categories.map((cat) => {
              const active = categoryId === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catPill, active && { backgroundColor: cat.color, borderColor: cat.color }]}
                  onPress={() => setCategoryId(active ? undefined : cat.id)}
                >
                  <View style={[styles.catPillDot, { backgroundColor: active ? '#fff' : cat.color }]} />
                  <Text style={[styles.catPillText, active && styles.catPillTextSelected]}>{cat.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Background */}
      <View style={styles.section}>
        <Text style={styles.label}>背景</Text>
        <BackgroundPicker
          themeColor={themeColor}
          coverImage={coverImage}
          onColorChange={setThemeColor}
          onCoverImageChange={setCoverImage}
        />
      </View>

      {/* Icon */}
      <View style={styles.section}>
        <Text style={styles.label}>图标</Text>
        <IconPicker selected={icon} onChange={setIcon} />
      </View>

      {/* Note */}
      <View style={styles.section}>
        <Text style={styles.label}>备注 / 心情</Text>
        <TextInput
          style={[styles.input, styles.noteInput]}
          placeholder="记录一下心情或备注…"
          placeholderTextColor="#C4C9D4"
          value={note ?? ''}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
          maxLength={200}
          textAlignVertical="top"
        />
      </View>

      {/* Preview */}
      <View style={styles.section}>
        <Text style={styles.label}>预览</Text>
        <PreviewCard
          title={title}
          type={type}
          themeColor={themeColor}
          coverImage={coverImage}
          iconId={icon}
        />
      </View>

      {/* Submit */}
      <TouchableOpacity style={[styles.submitBtn, { backgroundColor: themeColor }]} onPress={handleSubmit}>
        <Text style={styles.submitText}>
          {initialData?.title ? '保存修改' : '添加活动'}
        </Text>
      </TouchableOpacity>

      {/* Delete */}
      {onDelete && (
        <TouchableOpacity style={styles.deleteBtn} onPress={() => setShowDeleteConfirm(true)}>
          <Text style={styles.deleteText}>删除活动</Text>
        </TouchableOpacity>
      )}

      <ConfirmDialog
        visible={showDeleteConfirm}
        title="删除活动？"
        message={`"${title}" 将被永久删除。`}
        confirmLabel="删除"
        onConfirm={() => { setShowDeleteConfirm(false); onDelete?.(); }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </ScrollView>
  );
}

function PreviewCard({
  title,
  type,
  themeColor,
  coverImage,
  iconId,
}: {
  title: string;
  type: EventType;
  themeColor: string;
  coverImage?: string;
  iconId?: string;
}) {
  const bg = parseBg(coverImage);
  const hasBg = bg.type !== 'none';
  const dark = hasBg ? (bg as { dark: boolean }).dark : false;
  const textColor = dark ? '#fff' : '#111827';
  const subColor = dark ? 'rgba(255,255,255,0.75)' : '#9CA3AF';
  const accentColor = dark ? '#fff' : themeColor;

  const content = (
    <View style={previewStyles.inner}>
      {iconId && (
        <View style={previewStyles.iconWrap}>
          <Text
            style={iconId.length > 2 ? previewStyles.iconKaomoji : previewStyles.iconEmoji}
            numberOfLines={iconId.length > 2 ? 2 : 1}
          >
            {iconId}
          </Text>
        </View>
      )}
      <View style={previewStyles.row}>
        <View style={previewStyles.left}>
          <Text style={[previewStyles.title, { color: textColor }]} numberOfLines={1}>
            {title || '活动名称'}
          </Text>
          <Text style={[previewStyles.sub, { color: subColor }]}>
            {type === 'countdown' ? '倒计时' : '正计时'}
          </Text>
        </View>
        <Text style={[previewStyles.number, { color: accentColor }]}>--</Text>
      </View>
    </View>
  );

  if (bg.type === 'gradient') {
    return (
      <LinearGradient colors={bg.preset.colors as [string, string, ...string[]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={previewStyles.card}>
        {content}
      </LinearGradient>
    );
  }
  if (bg.type === 'image') {
    return (
      <ImageBackground source={{ uri: bg.uri }} style={previewStyles.card} imageStyle={previewStyles.cardRadius}>
        <View style={previewStyles.overlay} />
        {content}
      </ImageBackground>
    );
  }
  return <View style={[previewStyles.card, previewStyles.cardWhite]}>{content}</View>;
}

const previewStyles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardWhite: { backgroundColor: '#fff' },
  cardRadius: { borderRadius: 20 },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  inner: { paddingHorizontal: 20, paddingVertical: 18 },
  iconWrap: { marginBottom: 8 },
  iconEmoji: { fontSize: 36, lineHeight: 42 },
  iconKaomoji: { fontSize: 13, lineHeight: 18, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  left: { flex: 1, marginRight: 16 },
  title: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  sub: { fontSize: 13 },
  number: { fontSize: 40, fontWeight: '800', minWidth: 56, textAlign: 'center' },
});

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#F5F6FA' },
  container: { padding: 20, paddingBottom: 56 },
  section: { marginTop: 28 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  manageCatBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  manageCatText: { fontSize: 12, color: '#9CA3AF' },

  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: '#111827',
  },
  noteInput: {
    minHeight: 88,
    paddingTop: 14,
    fontSize: 15,
  },
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 6 },
  dateButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  dateButtonText: { fontSize: 16, color: '#111827' },
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: '#EDEEF2',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  segmentText: { fontSize: 13, fontWeight: '600', color: '#9CA3AF' },
  segmentTextActive: { color: '#fff' },

  catPillRow: { flexDirection: 'row', gap: 8, paddingBottom: 4 },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  catPillSelected: { borderColor: '#111827', backgroundColor: '#111827' },
  catPillText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  catPillTextSelected: { color: '#fff' },
  catPillDot: { width: 8, height: 8, borderRadius: 4 },

  submitBtn: {
    marginTop: 40,
    borderRadius: 18,
    paddingVertical: 17,
    alignItems: 'center',
  },
  submitText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  deleteBtn: {
    marginTop: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteText: { fontSize: 15, color: '#EF4444', fontWeight: '600' },
});
