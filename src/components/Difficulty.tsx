import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../theme'
import type { Difficulty as DifficultyLevel } from '../types/game'

type DifficultyProps = {
  level: DifficultyLevel
  compact?: boolean
}

const CONFIG: Record<DifficultyLevel, { label: string; icon: keyof typeof Ionicons.glyphMap; color: string; bg: string; border: string }> = {
  beginner: {
    label: 'Beginner',
    icon: 'leaf-outline',
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.12)',
    border: '#4ade80',
  },
  intermediate: {
    label: 'Intermediate',
    icon: 'flash-outline',
    color: colors.accent,
    bg: 'rgba(200,241,53,0.12)',
    border: colors.accent,
  },
  advanced: {
    label: 'Advanced',
    icon: 'flame-outline',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.12)',
    border: '#f97316',
  },
}

export function Difficulty({ level, compact = false }: DifficultyProps) {
  const { label, icon, color, bg, border } = CONFIG[level]

  if (compact) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 3,
          backgroundColor: bg,
          borderRadius: 20,
          paddingHorizontal: 7,
          paddingVertical: 3,
          borderWidth: 0.5,
          borderColor: border,
        }}
      >
        <Ionicons name={icon} size={10} color={color} />
        <Text style={{ fontSize: 10, fontWeight: '600', color }}>{label}</Text>
      </View>
    )
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: bg,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 0.5,
        borderColor: border,
      }}
    >
      <Ionicons name={icon} size={12} color={color} />
      <Text style={{ fontSize: 11, fontWeight: '600', color }}>{label}</Text>
    </View>
  )
}
