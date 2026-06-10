import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native'
import { router } from 'expo-router'
import { colors } from '../../src/theme'
import { Ionicons } from '@expo/vector-icons'
import { TasteMatch } from '../../src/components/TasteMatch'
import { getTasteMatch } from '../../src/lib/tasteMatch'
import { formatVenueLabel, getGigImageColor, getGigs } from '../../src/lib/gigs'
import type { GigStatus } from '../../src/types/gig'

const TABS = ['Tonight', 'This week', 'Future Gigs']
const FILTERS = ['All areas', 'Inner West', 'City', 'Nth Beaches', 'East']

function BadgePill({ status }: { status: GigStatus }) {
  if (status === 'live') return (
    <View style={{ backgroundColor: colors.live, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
      <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>● Live now</Text>
    </View>
  )
  if (status === 'tonight') return (
    <View style={{ backgroundColor: colors.accent, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
      <Text style={{ color: colors.accentDark, fontSize: 10, fontWeight: '600' }}>Tonight</Text>
    </View>
  )
  return (
    <View style={{ backgroundColor: 'transparent', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 0.5, borderColor: colors.accent }}>
      <Text style={{ color: colors.accent, fontSize: 10, fontWeight: '600' }}>Free entry</Text>
    </View>
  )
}

export default function HomeScreen() {
  const [activeFilter, setActiveFilter] = React.useState('All areas')
  const [activeTab, setActiveTab] = React.useState('Tonight')

  const gigs = React.useMemo(
    () => getGigs({ area: activeFilter }),
    [activeFilter],
  )

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 56, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 26, fontWeight: '500', color: colors.textPrimary }}>
          gig<Text style={{ color: colors.accent }}>.</Text>
        </Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Ionicons name="search-outline" size={22} color={colors.textSecondary} />
          <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
        </View>
      </View>

      {/* Time tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, borderBottomWidth: 0.5, borderBottomColor: colors.border, marginBottom: 10 }}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={{ paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 2, borderBottomColor: activeTab === tab ? colors.accent : 'transparent', marginRight: 4 }}
          >
            <Text style={{ fontSize: 13, fontWeight: activeTab === tab ? '600' : '400', color: activeTab === tab ? colors.accent : colors.textMuted }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Area filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 6, paddingHorizontal: 16, alignItems: 'center' }}
        style={{ flexGrow: 0, marginBottom: 10 }}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={{
              backgroundColor: activeFilter === f ? colors.accent : colors.surface,
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderWidth: 0.5,
              borderColor: activeFilter === f ? colors.accent : colors.borderStrong,
              marginVertical: 8,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '500', color: activeFilter === f ? colors.accentDark : colors.textSecondary }}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Section label */}
      <Text style={{ fontSize: 11, color: colors.textMuted, paddingHorizontal: 16, letterSpacing: 0.8, marginBottom: 8 }}>ON NOW</Text>

      {/* Gig feed */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {gigs.map((gig) => (
          <TouchableOpacity key={gig.id} onPress={() => router.push(`/gig/${gig.id}`)} style={{ backgroundColor: colors.surface, borderRadius: 14, overflow: 'hidden', borderWidth: 0.5, borderColor: colors.borderStrong }}>
            <View style={{ height: 160, backgroundColor: getGigImageColor(gig), alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ position: 'absolute', top: 10, left: 10 }}>
                <BadgePill status={gig.status} />
              </View>
              <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 0.5, borderColor: '#444' }}>
                <Text style={{ color: '#ccc', fontSize: 10 }}>{gig.genre}</Text>
              </View>
              <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: '#fff' }}>{gig.band}</Text>
                <Text style={{ fontSize: 11, color: '#aaa' }}>{formatVenueLabel(gig)}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderTopWidth: 0.5, borderTopColor: colors.border }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
                <Text style={{ fontSize: 11, color: colors.textSecondary }}>{gig.doorsTime}</Text>
                <Text style={{ color: '#444' }}>·</Text>
                <Text style={{ fontSize: 11, color: colors.accent }}>{gig.price}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {gig.interested != null && (
                  <Text style={{ fontSize: 11, color: colors.textMuted }}>🔥 {gig.interested}</Text>
                )}
                <TasteMatch score={getTasteMatch(gig.id)} compact />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}
