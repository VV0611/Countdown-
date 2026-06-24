import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME_COLORS } from '../types';

interface Props {
  selected: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ selected, onChange }: Props) {
  return (
    <View style={styles.row}>
      {THEME_COLORS.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.swatch,
            { backgroundColor: color },
            selected === color && styles.swatchSelected,
          ]}
          onPress={() => onChange(color)}
          activeOpacity={0.8}
        >
          {selected === color && (
            <Ionicons name="checkmark" size={18} color="#fff" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
