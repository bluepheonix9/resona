import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { SkillMatch } from '../../src/components/SkillMatch'
import { formatVenueLabel, getGameImageColor, getGames } from '../../src/lib/games'
import { getSkillMatch } from '../../src/lib/skillMatch'
import { colors } from '../../src/theme'
import type { GameStatus } from '../../src/types/game'

const TABS = ['Today', 'This week', 'Weekend']
const FILTERS = ['All sports', 'Basketball', 'Soccer', 'Tennis', 'Volleyball', 'Touch Footy']

const WARNING = '#FF9500'

function BadgePill({ status }: { status: GameStatus }) {
  if (status === 'live') return (
    <View style={{ backgroundColor: colors.live, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
      <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>● In progress</Text>
    </View>
  )
  if (status === 'upcoming') return (
    <View style={{ backgroundColor: colors.accent, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
      <Text style={{ color: colors.accentDark, fontSize: 10, fontWeight: '600' }}>Upcoming</Text>
    </View>
  )
  return (
    <View style={{ backgroundColor: 'transparent', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 0.5, borderColor: colors.accent }}>
      <Text style={{ color: colors.accent, fontSize: 10, fontWeight: '600' }}>Open to join</Text>
    </View>
  )
}

export default function HomeScreen() {
  const [activeFilter, setActiveFilter] = React.useState('All sports')
  const [activeTab, setActiveTab] = React.useState('Today')

  const games = React.useMemo(
    () => getGames({ sport: activeFilter }),
    [activeFilter],
  )

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 56, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 26, fontWeight: '500', color: colors.textPrimary }}>
          pickup<Text style={{ color: colors.accent }}>.</Text>
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

      {/* Sport filters */}
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
      <Text style={{ fontSize: 11, color: colors.textMuted, paddingHorizontal: 16, letterSpacing: 0.8, marginBottom: 8 }}>HAPPENING NOW</Text>

      {/* Game feed */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {games.map((game) => {
          const lowSpots = game.spotsLeft <= 3
          return (
            <TouchableOpacity key={game.id} onPress={() => router.push(`/game/${game.id}`)} style={{ backgroundColor: colors.surface, borderRadius: 14, overflow: 'hidden', borderWidth: 0.5, borderColor: colors.borderStrong }}>
              <View style={{ height: 160, backgroundColor: getGameImageColor(game), alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ position: 'absolute', top: 10, left: 10 }}>
                  <BadgePill status={game.status} />
                </View>
                <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 0.5, borderColor: '#444' }}>
                  <Text style={{ color: '#ccc', fontSize: 10 }}>{game.sport}</Text>
                </View>
                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <Text style={{ fontSize: 15, fontWeight: '500', color: '#fff' }}>{game.title}</Text>
                  <Text style={{ fontSize: 11, color: '#aaa' }}>{formatVenueLabel(game)}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderTopWidth: 0.5, borderTopColor: colors.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
                  <Text style={{ fontSize: 11, color: colors.textSecondary }}>{game.startTime}</Text>
                  <Text style={{ color: '#444' }}>·</Text>
                  <Text style={{ fontSize: 11, color: colors.accent }}>{game.price}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 11, color: lowSpots ? WARNING : colors.textMuted, fontWeight: lowSpots ? '600' : '400' }}>{game.spotsLeft} spots left</Text>
                  <SkillMatch score={getSkillMatch(game.id)} compact />
                </View>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}
