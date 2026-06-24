import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Modal, Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore, FONT_SIZE_LABEL, FontSizeOption, ColorSchemeOption } from '../src/store/settingsStore';
import { useCategoryStore, EventCategory } from '../src/store/categoryStore';
import { useTheme } from '../src/theme/ThemeContext';
import { useEventStore } from '../src/store/eventStore';
import { exportEvents, importEvents } from '../src/utils/backupUtils';

const CATEGORY_PALETTE = [
  '#F472B6', '#EF4444', '#FB923C', '#FBBF24',
  '#34D399', '#60A5FA', '#818CF8', '#A78BFA',
];

const COLOR_SCHEME_LABELS: Record<ColorSchemeOption, string> = {
  light: '浅色',
  dark: '深色',
  system: '跟随系统',
};

export default function SettingsScreen() {
  const { fontSize, setFontSize, colorScheme, setColorScheme } = useSettingsStore();
  const { categories, addCategory, removeCategory } = useCategoryStore();
  const { colors } = useTheme();
  const { events, replaceAll, mergeEvents } = useEventStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newColor, setNewColor] = useState(CATEGORY_PALETTE[5]);
  const [labelError, setLabelError] = useState(false);

  function handleAddCategory() {
    if (!newLabel.trim()) { setLabelError(true); return; }
    addCategory(newLabel.trim(), newColor);
    setNewLabel('');
    setNewColor(CATEGORY_PALETTE[5]);
    setLabelError(false);
    setModalVisible(false);
  }

  function handleDelete(cat: EventCategory) {
    Alert.alert('删除分类', `确认删除「${cat.label}」？`, [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => removeCategory(cat.id) },
    ]);
  }

  return (
    <>
      <Stack.Screen options={{ title: '设置' }} />
      <ScrollView style={[styles.scroll, { backgroundColor: colors.background }]} contentContainerStyle={styles.container}>

        {/* Appearance / Dark mode */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>外观</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={[styles.schemeRow, { backgroundColor: colors.segmentBg }]}>
            {(['light', 'dark', 'system'] as ColorSchemeOption[]).map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.schemeBtn, colorScheme === opt && styles.schemeBtnActive]}
                onPress={() => setColorScheme(opt)}
              >
                <Text style={[styles.schemeBtnText, colorScheme === opt && styles.schemeBtnTextActive]}>
                  {COLOR_SCHEME_LABELS[opt]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Font size */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>字体大小</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={[styles.fontRow, { backgroundColor: colors.segmentBg, margin: 12, borderRadius: 14, padding: 4 }]}>
            {(['small', 'normal', 'large'] as FontSizeOption[]).map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.fontBtn, fontSize === opt && styles.fontBtnActive]}
                onPress={() => setFontSize(opt)}
              >
                <Text style={[
                  styles.fontBtnText,
                  { fontSize: opt === 'small' ? 13 : opt === 'large' ? 19 : 16, color: colors.textMuted },
                  fontSize === opt && styles.fontBtnTextActive,
                ]}>
                  {FONT_SIZE_LABEL[opt]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.fontPreview, { color: colors.textMuted }]}>
            预览文字大小 {fontSize === 'small' ? '（小）' : fontSize === 'large' ? '（大）' : '（中）'}
          </Text>
        </View>

        {/* Category management */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>事件分类</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={20} color="#5B8DEF" />
            <Text style={styles.addBtnText}>新增</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {categories.map((cat, idx) => (
            <View key={cat.id}>
              {idx > 0 && <View style={[styles.divider, { backgroundColor: colors.divider }]} />}
              <View style={styles.catRow}>
                <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                <Text style={[styles.catLabel, { color: colors.text }]}>{cat.label}</Text>
                {cat.isDefault ? (
                  <Text style={[styles.defaultBadge, { backgroundColor: colors.pillBg, color: colors.textMuted }]}>默认</Text>
                ) : (
                  <TouchableOpacity onPress={() => handleDelete(cat)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="trash-outline" size={17} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Data backup */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>数据</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={styles.dataRow}
            onPress={() => exportEvents(events)}
          >
            <Ionicons name="cloud-upload-outline" size={20} color="#5B8DEF" style={styles.dataIcon} />
            <View style={styles.dataText}>
              <Text style={[styles.dataTitle, { color: colors.text }]}>导出备份</Text>
              <Text style={[styles.dataSub, { color: colors.textMuted }]}>将 {events.length} 个活动导出为 JSON 文件</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.divider, marginLeft: 52 }]} />

          <TouchableOpacity
            style={styles.dataRow}
            onPress={async () => {
              const imported = await importEvents();
              if (!imported) return;
              Alert.alert(
                '导入备份',
                `检测到 ${imported.length} 个活动，请选择导入方式`,
                [
                  { text: '取消', style: 'cancel' },
                  {
                    text: '合并（保留现有）',
                    onPress: () => {
                      mergeEvents(imported);
                      Alert.alert('导入成功', '已合并新活动');
                    },
                  },
                  {
                    text: '替换全部',
                    style: 'destructive',
                    onPress: () => {
                      replaceAll(imported);
                      Alert.alert('导入成功', '数据已替换');
                    },
                  },
                ]
              );
            }}
          >
            <Ionicons name="cloud-download-outline" size={20} color="#34D399" style={styles.dataIcon} />
            <View style={styles.dataText}>
              <Text style={[styles.dataTitle, { color: colors.text }]}>导入恢复</Text>
              <Text style={[styles.dataSub, { color: colors.textMuted }]}>从 JSON 备份文件恢复活动</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>

      {/* Add category modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={[styles.modalBackdrop, { backgroundColor: colors.modalOverlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.modalBg }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>新增分类</Text>

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>分类名称</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, color: colors.text }, labelError && styles.inputError]}
              placeholder="例：健身打卡"
              placeholderTextColor={colors.textPlaceholder}
              value={newLabel}
              onChangeText={(t) => { setNewLabel(t); setLabelError(false); }}
              maxLength={12}
              autoFocus
            />
            {labelError && <Text style={styles.errorText}>请填写分类名称</Text>}

            <Text style={[styles.inputLabel, { color: colors.textSecondary, marginTop: 16 }]}>颜色</Text>
            <View style={styles.colorRow}>
              {CATEGORY_PALETTE.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.colorDot, { backgroundColor: c }, newColor === c && styles.colorDotActive]}
                  onPress={() => setNewColor(c)}
                />
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={() => { setModalVisible(false); setNewLabel(''); setLabelError(false); }}>
                <Text style={[styles.cancelText, { color: colors.textMuted }]}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: newColor }]} onPress={handleAddCategory}>
                <Text style={styles.confirmText}>添加</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: 20 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 28, marginBottom: 12 },
  sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 28, marginBottom: 12 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addBtnText: { fontSize: 14, color: '#5B8DEF', fontWeight: '600' },

  card: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  schemeRow: {
    flexDirection: 'row',
    margin: 12,
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  schemeBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  schemeBtnActive: { backgroundColor: '#5B8DEF' },
  schemeBtnText: { fontSize: 13, fontWeight: '600', color: '#9CA3AF' },
  schemeBtnTextActive: { color: '#fff' },

  fontRow: { flexDirection: 'row', gap: 4 },
  fontBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 14,
    borderRadius: 12,
  },
  fontBtnActive: { backgroundColor: '#EEF4FF' },
  fontBtnText: { fontWeight: '700' },
  fontBtnTextActive: { color: '#5B8DEF' },
  fontPreview: { fontSize: 13, textAlign: 'center', paddingBottom: 14 },

  divider: { height: StyleSheet.hairlineWidth, marginLeft: 48 },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  catDot: { width: 12, height: 12, borderRadius: 6 },
  catLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  defaultBadge: { fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, fontWeight: '600' },

  // Data row
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dataIcon: { marginRight: 12 },
  dataText: { flex: 1 },
  dataTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  dataSub: { fontSize: 12 },

  // Modal
  modalBackdrop: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36 },
  modalTitle: { fontSize: 17, fontWeight: '700', marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  input: {
    borderRadius: 12, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 13, fontSize: 15,
  },
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 4 },
  colorRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  colorDot: { width: 32, height: 32, borderRadius: 16, borderWidth: 3, borderColor: 'transparent' },
  colorDotActive: { borderColor: '#111827' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  cancelText: { fontSize: 15, fontWeight: '600' },
  confirmBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  confirmText: { fontSize: 15, color: '#fff', fontWeight: '700' },
});
