import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export default function EmptyState() {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Ionicons name="calendar-outline" size={72} color={colors.border} />
      <Text style={[styles.heading, { color: colors.textSecondary }]}>还没有活动</Text>
      <Text style={[styles.sub, { color: colors.textMuted }]}>点击右上角 + 添加第一个倒数日</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingBottom: 80,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  sub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
