import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../theme'
import { getTasteMatchLabel } from '../lib/tasteMatch'

type TasteMatchProps = {
  score: number
  compact?: boolean
}

export function TasteMatch({ score, compact = false }: TasteMatchProps) {
  const isHigh = score >= 80
  const isMid = score >= 70

  const accent = isHigh ? colors.accent : isMid ? colors.textSecondary : colors.textMuted
  const bg = isHigh ? 'rgba(200,241,53,0.12)' : colors.surface2
  const border = isHigh ? colors.accent : colors.borderStrong

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
        <Ionicons name="sparkles" size={10} color={accent} />
        <Text style={{ fontSize: 10, fontWeight: '600', color: accent }}>{score}%</Text>
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
      <Ionicons name="sparkles" size={12} color={accent} />
      <View>
        <Text style={{ fontSize: 11, fontWeight: '600', color: accent }}>{score}% taste match</Text>
        {!compact && (
          <Text style={{ fontSize: 9, color: colors.textMuted }}>{getTasteMatchLabel(score)}</Text>
        )}
      </View>
    </View>
  )
}
