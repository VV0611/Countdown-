import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Modal, Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore, FONT_SIZE_LABEL, FontSizeOption } from '../src/store/settingsStore';
import { useCategoryStore, EventCategory } from '../src/store/categoryStore';

const CATEGORY_PALETTE = [
  '#F472B6', '#EF4444', '#FB923C', '#FBBF24',
  '#34D399', '#60A5FA', '#818CF8', '#A78BFA',
];

export default function SettingsScreen() {
  const { fontSize, setFontSize } = useSettingsStore();
  const { categories, addCategory, removeCategory } = useCategoryStore();

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
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>

        {/* Font size */}
        <Text style={styles.sectionTitle}>字体大小</Text>
        <View style={styles.card}>
          <View style={styles.fontRow}>
            {(['small', 'normal', 'large'] as FontSizeOption[]).map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.fontBtn, fontSize === opt && styles.fontBtnActive]}
                onPress={() => setFontSize(opt)}
              >
                <Text style={[
                  styles.fontBtnText,
                  { fontSize: opt === 'small' ? 13 : opt === 'large' ? 19 : 16 },
                  fontSize === opt && styles.fontBtnTextActive,
                ]}>
                  {FONT_SIZE_LABEL[opt]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.fontPreview}>
            预览文字大小 {fontSize === 'small' ? '（小）' : fontSize === 'large' ? '（大）' : '（中）'}
          </Text>
        </View>

        {/* Category management */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>事件分类</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={20} color="#5B8DEF" />
            <Text style={styles.addBtnText}>新增</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {categories.map((cat, idx) => (
            <View key={cat.id}>
              {idx > 0 && <View style={styles.divider} />}
              <View style={styles.catRow}>
                <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                <Text style={styles.catLabel}>{cat.label}</Text>
                {cat.isDefault ? (
                  <Text style={styles.defaultBadge}>默认</Text>
                ) : (
                  <TouchableOpacity onPress={() => handleDelete(cat)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="trash-outline" size={17} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>

      {/* Add category modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>新增分类</Text>

            <Text style={styles.inputLabel}>分类名称</Text>
            <TextInput
              style={[styles.input, labelError && styles.inputError]}
              placeholder="例：健身打卡"
              placeholderTextColor="#C4C9D4"
              value={newLabel}
              onChangeText={(t) => { setNewLabel(t); setLabelError(false); }}
              maxLength={12}
              autoFocus
            />
            {labelError && <Text style={styles.errorText}>请填写分类名称</Text>}

            <Text style={[styles.inputLabel, { marginTop: 16 }]}>颜色</Text>
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
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setModalVisible(false); setNewLabel(''); setLabelError(false); }}>
                <Text style={styles.cancelText}>取消</Text>
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
  scroll: { flex: 1, backgroundColor: '#F5F6FA' },
  container: { padding: 20 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 28, marginBottom: 12 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 28, marginBottom: 12 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addBtnText: { fontSize: 14, color: '#5B8DEF', fontWeight: '600' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  fontRow: { flexDirection: 'row', gap: 10, padding: 16 },
  fontBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 14,
    borderRadius: 12, backgroundColor: '#F3F4F6',
    borderWidth: 2, borderColor: 'transparent',
  },
  fontBtnActive: { backgroundColor: '#EEF4FF', borderColor: '#5B8DEF' },
  fontBtnText: { fontWeight: '700', color: '#9CA3AF' },
  fontBtnTextActive: { color: '#5B8DEF' },
  fontPreview: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', paddingBottom: 14 },

  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#F3F4F6', marginLeft: 48 },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  catDot: { width: 12, height: 12, borderRadius: 6 },
  catLabel: { flex: 1, fontSize: 15, color: '#111827', fontWeight: '500' },
  defaultBadge: { fontSize: 11, color: '#9CA3AF', backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, fontWeight: '600' },

  // Modal
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: {
    backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB',
    paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: '#111827',
  },
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 4 },
  colorRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  colorDot: { width: 32, height: 32, borderRadius: 16, borderWidth: 3, borderColor: 'transparent' },
  colorDotActive: { borderColor: '#111827' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  cancelText: { fontSize: 15, color: '#6B7280', fontWeight: '600' },
  confirmBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  confirmText: { fontSize: 15, color: '#fff', fontWeight: '700' },
});
