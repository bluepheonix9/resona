import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'
import { formatGameDateLong, formatVenueLabel } from '../lib/games'
import { colors } from '../theme'
import type { Game } from '../types/game'

type JoinSheetProps = {
  game: Game
  visible: boolean
  spotsLeft: number
  onClose: () => void
  onConfirm: () => void
}

function InfoLine({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Ionicons name={icon} size={15} color={colors.textSecondary} />
      <Text style={{ fontSize: 13, color: colors.textSecondary }}>{text}</Text>
    </View>
  )
}

// Bottom-sheet confirm for grabbing a spot. Two states: confirm → success.
export function JoinSheet({ game, visible, spotsLeft, onClose, onConfirm }: JoinSheetProps) {
  const [confirmed, setConfirmed] = React.useState(false)

  // Reset to the confirm step each time the sheet opens.
  React.useEffect(() => {
    if (visible) setConfirmed(false)
  }, [visible])

  function handleConfirm() {
    onConfirm()
    setConfirmed(true)
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}
      >
        {/* Stop taps on the sheet itself from dismissing */}
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: colors.surface,
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 36,
            borderWidth: 0.5,
            borderColor: colors.borderStrong,
          }}
        >
          <View style={{ alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong, marginBottom: 20 }} />

          {confirmed ? (
            <View style={{ alignItems: 'center', paddingVertical: 8 }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Ionicons name="checkmark" size={30} color={colors.accentDark} />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '600', color: colors.textPrimary, marginBottom: 6 }}>You're in!</Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24 }}>
                Your spot for {game.title} is locked in. See you at {game.venue.name}.
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={{ width: '100%', alignItems: 'center', backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14 }}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.accentDark }}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={{ fontSize: 20, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 }}>Grab your spot</Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 18 }}>{game.title}</Text>

              <View style={{ gap: 10, backgroundColor: colors.surface2, borderRadius: 12, padding: 14, borderWidth: 0.5, borderColor: colors.borderStrong, marginBottom: 10 }}>
                <InfoLine icon="calendar-outline" text={formatGameDateLong(game)} />
                <InfoLine icon="time-outline" text={game.startTime} />
                <InfoLine icon="location-outline" text={formatVenueLabel(game)} />
                <InfoLine icon="pricetag-outline" text={`Entry ${game.price}`} />
              </View>

              <Text style={{ fontSize: 12, color: spotsLeft <= 3 ? '#FF9500' : colors.textMuted, marginBottom: 18 }}>
                {spotsLeft} of {game.spots} spots left
              </Text>

              <TouchableOpacity
                onPress={handleConfirm}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, marginBottom: 10 }}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color={colors.accentDark} />
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.accentDark }}>Confirm spot</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose} style={{ alignItems: 'center', paddingVertical: 10 }}>
                <Text style={{ fontSize: 14, color: colors.textSecondary }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  )
}
