import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <Ionicons name="calendar-outline" size={72} color="#E5E7EB" />
      <Text style={styles.heading}>还没有活动</Text>
      <Text style={styles.sub}>点击右上角 + 添加第一个倒数日</Text>
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
    color: '#374151',
    marginTop: 8,
  },
  sub: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});
