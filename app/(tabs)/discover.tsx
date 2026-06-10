import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StatusBar, TextInput } from 'react-native'
import { router } from 'expo-router'
import { colors } from '../../src/theme'
import { Ionicons } from '@expo/vector-icons'
import { TasteMatch } from '../../src/components/TasteMatch'
import { getTasteMatch } from '../../src/lib/tasteMatch'
import {
  getBrowseGenres,
  getBrowseVibes,
  getGigImageColor,
  getStaffPicks,
  getVenues,
} from '../../src/lib/gigs'
import type { Gig } from '../../src/types/gig'

function SectionLabel({ children }: { children: string }) {
  return (
    <Text style={{ fontSize: 11, color: colors.textMuted, letterSpacing: 0.8, marginBottom: 10 }}>
      {children}
    </Text>
  )
}

function StaffPickCard({ gig }: { gig: Gig }) {
  const tasteMatch = getTasteMatch(gig.id)

  return (
    <TouchableOpacity
      onPress={() => router.push(`/gig/${gig.id}`)}
      style={{
        width: 200,
        backgroundColor: colors.surface,
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: colors.borderStrong,
        marginRight: 10,
      }}
    >
      <View style={{ height: 110, backgroundColor: getGigImageColor(gig), justifyContent: 'flex-end', padding: 10 }}>
        <View style={{ position: 'absolute', top: 8, right: 8 }}>
          <TasteMatch score={tasteMatch} compact />
        </View>
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>{gig.band}</Text>
        <Text style={{ fontSize: 10, color: '#aaa' }}>{gig.venue.name}</Text>
      </View>
      <View style={{ padding: 8, gap: 4 }}>
        <Text style={{ fontSize: 10, color: colors.textMuted }}>{gig.genre}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 10, color: colors.textSecondary }}>{gig.doorsTime}</Text>
          <Text style={{ fontSize: 10, color: colors.accent, fontWeight: '500' }}>{gig.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default function DiscoverScreen() {
  const [activeVibe, setActiveVibe] = React.useState<string | null>(null)

  const staffPicks = getStaffPicks()
  const genres = getBrowseGenres()
  const vibes = getBrowseVibes()
  const venues = getVenues()

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12 }}>
          <Text style={{ fontSize: 26, fontWeight: '500', color: colors.textPrimary, marginBottom: 12 }}>
            discover<Text style={{ color: colors.accent }}>.</Text>
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.surface,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderWidth: 0.5,
              borderColor: colors.borderStrong,
              gap: 8,
            }}
          >
            <Ionicons name="search-outline" size={18} color={colors.textMuted} />
            <TextInput
              placeholder="Bands, venues, genres..."
              placeholderTextColor={colors.textMuted}
              style={{ flex: 1, fontSize: 14, color: colors.textPrimary }}
            />
          </View>
        </View>

        <View style={{ paddingLeft: 16, marginBottom: 24 }}>
          <SectionLabel>STAFF PICKS FOR YOU</SectionLabel>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {staffPicks.map((gig) => (
              <StaffPickCard key={gig.id} gig={gig} />
            ))}
          </ScrollView>
        </View>

        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <SectionLabel>BROWSE BY GENRE</SectionLabel>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {genres.map((genre) => (
              <TouchableOpacity
                key={genre.id}
                style={{
                  width: '31%',
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 12,
                  borderWidth: 0.5,
                  borderColor: colors.borderStrong,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '500', color: colors.textPrimary }}>
                  {genre.label}
                </Text>
                <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>{genre.count} gigs</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <SectionLabel>BROWSE BY VIBE</SectionLabel>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {vibes.map((vibe) => (
              <TouchableOpacity
                key={vibe}
                onPress={() => setActiveVibe(activeVibe === vibe ? null : vibe)}
                style={{
                  backgroundColor: activeVibe === vibe ? colors.accent : colors.surface,
                  borderRadius: 20,
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderWidth: 0.5,
                  borderColor: activeVibe === vibe ? colors.accent : colors.borderStrong,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: activeVibe === vibe ? colors.accentDark : colors.textSecondary,
                  }}
                >
                  {vibe}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <SectionLabel>VENUES</SectionLabel>
          <View style={{ gap: 8 }}>
            {venues.map((venue) => (
              <TouchableOpacity
                key={venue.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 14,
                  borderWidth: 0.5,
                  borderColor: colors.borderStrong,
                }}
              >
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
                    <Ionicons name="business-outline" size={16} color={colors.textSecondary} />
                  </View>
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary }}>{venue.name}</Text>
                    <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                      {venue.area} · {venue.gigs} upcoming
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
