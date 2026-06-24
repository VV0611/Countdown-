import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
  THEME_COLORS,
  GRADIENT_PRESETS,
  GRADIENT_CATEGORY_LABELS,
  GradientCategory,
} from '../types';

type Tab = 'color' | 'gradient' | 'photo';

interface Props {
  themeColor: string;
  coverImage?: string;
  onColorChange: (color: string) => void;
  onCoverImageChange: (uri: string | undefined) => void;
}

const CATEGORY_ORDER: GradientCategory[] = [
  'sakura', 'wa', 'shiki', 'wabi', 'yugen', 'sumi',
];

export default function BackgroundPicker({
  themeColor,
  coverImage,
  onColorChange,
  onCoverImageChange,
}: Props) {
  const activeTab: Tab = coverImage
    ? coverImage.startsWith('gradient:') ? 'gradient' : 'photo'
    : 'color';

  const [tab, setTab] = useState<Tab>(activeTab);

  async function pickImage() {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('需要权限', '请在设置中允许访问相册');
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      onCoverImageChange(result.assets[0].uri);
    }
  }

  function selectTab(t: Tab) {
    setTab(t);
    if (t === 'color') onCoverImageChange(undefined);
  }

  const selectedGradientId = coverImage?.startsWith('gradient:')
    ? coverImage.slice(9)
    : null;

  return (
    <View>
      {/* Tabs */}
      <View style={styles.tabs}>
        {([['color', '纯色'], ['gradient', '渐变风格'], ['photo', '照片']] as [Tab, string][]).map(
          ([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[styles.tab, tab === key && styles.tabActive]}
              onPress={() => selectTab(key)}
            >
              <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* ── 纯色 ── */}
      {tab === 'color' && (
        <View style={styles.colorRow}>
          {THEME_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorSwatch,
                { backgroundColor: color },
                themeColor === color && !coverImage && styles.swatchSelected,
              ]}
              onPress={() => { onColorChange(color); onCoverImageChange(undefined); }}
              activeOpacity={0.8}
            >
              {themeColor === color && !coverImage && (
                <Ionicons name="checkmark" size={18} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── 渐变风格 ── */}
      {tab === 'gradient' && (
        <View style={styles.gradientSection}>
          {CATEGORY_ORDER.map((cat) => {
            const presets = GRADIENT_PRESETS.filter((p) => p.category === cat);
            return (
              <View key={cat} style={styles.categoryBlock}>
                <Text style={styles.categoryLabel}>
                  {GRADIENT_CATEGORY_LABELS[cat]}
                </Text>
                <View style={styles.gradientGrid}>
                  {presets.map((preset) => {
                    const selected = selectedGradientId === preset.id;
                    return (
                      <TouchableOpacity
                        key={preset.id}
                        style={styles.gradientCell}
                        onPress={() => {
                          onCoverImageChange(`gradient:${preset.id}`);
                          onColorChange(preset.colors[0]);
                        }}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={preset.colors as [string, string, ...string[]]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={[
                            styles.gradientSwatch,
                            selected && styles.swatchSelectedBorder,
                          ]}
                        >
                          {selected && (
                            <Ionicons name="checkmark" size={14} color="#fff" />
                          )}
                        </LinearGradient>
                        <Text style={styles.gradientLabel}>{preset.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* ── 照片 ── */}
      {tab === 'photo' && (
        <View style={styles.photoSection}>
          {coverImage && !coverImage.startsWith('gradient:') && (
            <View style={styles.photoPreviewWrap}>
              <Image source={{ uri: coverImage }} style={styles.photoPreview} />
              <TouchableOpacity
                style={styles.removePhoto}
                onPress={() => { onCoverImageChange(undefined); setTab('color'); }}
              >
                <Ionicons name="close-circle" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
            <Ionicons name="image-outline" size={20} color="#5B8DEF" />
            <Text style={styles.uploadText}>从相册选取</Text>
          </TouchableOpacity>
          <Text style={styles.photoHint}>建议正方形图片，比例 1:1 效果最佳</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#EDEEF2',
    borderRadius: 14,
    padding: 4,
    gap: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 11,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  tabText: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  tabTextActive: { color: '#111827' },

  // Color
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 4,
  },

  // Gradient
  gradientSection: { gap: 20 },
  categoryBlock: { gap: 8 },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gradientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gradientCell: {
    alignItems: 'center',
    width: '14%',
    gap: 4,
  },
  gradientSwatch: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchSelectedBorder: {
    borderWidth: 2.5,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  gradientLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Photo
  photoSection: { gap: 12 },
  photoPreviewWrap: { borderRadius: 14, overflow: 'hidden', position: 'relative' },
  photoPreview: { width: '100%', aspectRatio: 1, borderRadius: 14 },
  removePhoto: { position: 'absolute', top: 8, right: 8 },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EEF3FD',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#5B8DEF',
    borderStyle: 'dashed',
  },
  uploadText: { fontSize: 15, fontWeight: '600', color: '#5B8DEF' },
  photoHint: { fontSize: 12, color: '#9CA3AF', textAlign: 'center' },
});
