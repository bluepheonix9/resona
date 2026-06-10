import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../src/theme'
import { GigHero } from '../../src/components/GigHero'
import { TasteMatch } from '../../src/components/TasteMatch'
import { getTasteMatch } from '../../src/lib/tasteMatch'
import { formatGigDateLong, formatVenueLabel, getGigById } from '../../src/lib/gigs'
import type { GigStatus } from '../../src/types/gig'

function BadgePill({ status }: { status: GigStatus }) {
  if (status === 'live') {
    return (
      <View style={{ backgroundColor: colors.live, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
        <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>● Live now</Text>
      </View>
    )
  }
  if (status === 'tonight') {
    return (
      <View style={{ backgroundColor: colors.accent, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
        <Text style={{ color: colors.accentDark, fontSize: 11, fontWeight: '600' }}>Tonight</Text>
      </View>
    )
  }
  return (
    <View style={{ backgroundColor: 'transparent', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 0.5, borderColor: colors.accent }}>
      <Text style={{ color: colors.accent, fontSize: 11, fontWeight: '600' }}>Free entry</Text>
    </View>
  )
}

function DetailRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          backgroundColor: colors.surface2,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 0.5,
          borderColor: colors.borderStrong,
        }}
      >
        <Ionicons name={icon} size={16} color={colors.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 11, color: colors.textMuted, marginBottom: 2 }}>{label}</Text>
        <Text style={{ fontSize: 14, color: colors.textPrimary, fontWeight: '500' }}>{value}</Text>
      </View>
    </View>
  )
}

export default function GigDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const gig = id ? getGigById(id) : undefined

  if (!gig) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ fontSize: 17, fontWeight: '500', color: colors.textPrimary, marginBottom: 8 }}>Gig not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 14, color: colors.accent }}>Go back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const tasteMatch = getTasteMatch(gig.id)

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ position: 'relative' }}>
          <GigHero gig={gig} height={300} />
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.25)' }} />
          <View style={{ position: 'absolute', top: 56, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 20,
                padding: 8,
                borderWidth: 0.5,
                borderColor: 'rgba(255,255,255,0.15)',
              }}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 20,
                padding: 8,
                borderWidth: 0.5,
                borderColor: 'rgba(255,255,255,0.15)',
              }}
            >
              <Ionicons name="heart-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
              <BadgePill status={gig.status} />
              {gig.staffPick && (
                <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.15)' }}>
                  <Text style={{ color: colors.accent, fontSize: 11, fontWeight: '600' }}>Staff pick</Text>
                </View>
              )}
            </View>
            <Text style={{ fontSize: 28, fontWeight: '500', color: '#fff', marginBottom: 4 }}>{gig.band}</Text>
            <Text style={{ fontSize: 14, color: '#ccc' }}>{formatVenueLabel(gig)}</Text>
          </View>
        </View>

        <View style={{ padding: 16, gap: 20 }}>
          <TasteMatch score={tasteMatch} />

          <View style={{ gap: 14 }}>
            <DetailRow icon="calendar-outline" label="Date" value={formatGigDateLong(gig)} />
            <DetailRow icon="time-outline" label="Doors" value={gig.doorsTime} />
            <DetailRow icon="pricetag-outline" label="Entry" value={gig.price} />
            <DetailRow icon="musical-notes-outline" label="Genre" value={gig.genre} />
            <DetailRow icon="location-outline" label="Venue" value={formatVenueLabel(gig)} />
          </View>

          {gig.vibes.length > 0 && (
            <View>
              <Text style={{ fontSize: 11, color: colors.textMuted, letterSpacing: 0.8, marginBottom: 10 }}>VIBES</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {gig.vibes.map((vibe) => (
                  <View
                    key={vibe}
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: 20,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderWidth: 0.5,
                      borderColor: colors.borderStrong,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>{vibe}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {gig.interested != null && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 14,
                borderWidth: 0.5,
                borderColor: colors.borderStrong,
              }}
            >
              <Text style={{ fontSize: 18 }}>🔥</Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                <Text style={{ color: colors.textPrimary, fontWeight: '500' }}>{gig.interested}</Text> people interested
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/map')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              backgroundColor: colors.accent,
              borderRadius: 12,
              paddingVertical: 14,
            }}
          >
            <Ionicons name="map-outline" size={18} color={colors.accentDark} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.accentDark }}>View on map</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
