import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native'
import { router } from 'expo-router'
import { colors } from '../../src/theme'
import { Ionicons } from '@expo/vector-icons'
import { SkillMatch } from '../../src/components/SkillMatch'
import { getSkillMatch } from '../../src/lib/skillMatch'
import {
  formatGameDate,
  formatVenueLabel,
  getGameImageColor,
  getGames,
  isGameUpcoming,
} from '../../src/lib/games'
import type { Game, GameStatus } from '../../src/types/game'

const TABS = ['Upcoming', 'Past']

// Local demo state until auth — maps game id → when it was saved
const SAVED_META: Record<string, { savedAt: string }> = {
  '2': { savedAt: '2 days ago' },
  '3': { savedAt: 'Yesterday' },
  '1': { savedAt: '1 week ago' },
}

const INITIAL_SAVED_IDS = Object.keys(SAVED_META)

function BadgePill({ game }: { game: Game }) {
  if (!isGameUpcoming(game)) {
    return (
      <View style={{ backgroundColor: colors.surface2, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 0.5, borderColor: colors.borderStrong }}>
        <Text style={{ color: colors.textSecondary, fontSize: 10, fontWeight: '600' }}>Past</Text>
      </View>
    )
  }

  const status: GameStatus = game.status
  if (status === 'live') {
    return (
      <View style={{ backgroundColor: colors.live, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
        <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>● In progress</Text>
      </View>
    )
  }
  if (status === 'upcoming') {
    return (
      <View style={{ backgroundColor: colors.accent, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
        <Text style={{ color: colors.accentDark, fontSize: 10, fontWeight: '600' }}>Upcoming</Text>
      </View>
    )
  }
  return (
    <View style={{ backgroundColor: 'transparent', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 0.5, borderColor: colors.accent }}>
      <Text style={{ color: colors.accent, fontSize: 10, fontWeight: '600' }}>Open to join</Text>
    </View>
  )
}

function EmptyState({ tab }: { tab: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingBottom: 80 }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Ionicons name="heart-outline" size={28} color={colors.textMuted} />
      </View>
      <Text style={{ fontSize: 17, fontWeight: '500', color: colors.textPrimary, marginBottom: 8 }}>
        {tab === 'Upcoming' ? 'No saved games yet' : 'Nothing in the past'}
      </Text>
      <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 }}>
        {tab === 'Upcoming'
          ? 'Tap the heart on any game to save it here and keep track of what you want to join.'
          : 'Games you saved will show up here after they\'ve passed.'}
      </Text>
    </View>
  )
}

export default function SavedScreen() {
  const [activeTab, setActiveTab] = React.useState('Upcoming')
  const [savedIds, setSavedIds] = React.useState(INITIAL_SAVED_IDS)

  const savedGames = getGames({ ids: savedIds })
  const filteredGames = savedGames.filter((game) =>
    activeTab === 'Upcoming' ? isGameUpcoming(game) : !isGameUpcoming(game),
  )

  const upcomingCount = savedGames.filter((g) => isGameUpcoming(g)).length

  function unsave(id: string) {
    setSavedIds((ids) => ids.filter((savedId) => savedId !== id))
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />

      <View style={{ paddingHorizontal: 16, paddingTop: 56, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={{ fontSize: 26, fontWeight: '500', color: colors.textPrimary }}>
            saved<Text style={{ color: colors.accent }}>.</Text>
          </Text>
          {upcomingCount > 0 && (
            <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
              {upcomingCount} upcoming
            </Text>
          )}
        </View>
        <TouchableOpacity>
          <Ionicons name="calendar-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', paddingHorizontal: 16, borderBottomWidth: 0.5, borderBottomColor: colors.border, marginBottom: 10 }}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderBottomWidth: 2,
              borderBottomColor: activeTab === tab ? colors.accent : 'transparent',
              marginRight: 4,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: activeTab === tab ? '600' : '400', color: activeTab === tab ? colors.accent : colors.textMuted }}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredGames.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <>
          <Text style={{ fontSize: 11, color: colors.textMuted, paddingHorizontal: 16, letterSpacing: 0.8, marginBottom: 8 }}>
            {activeTab === 'Upcoming' ? 'COMING UP' : 'PAST GAMES'}
          </Text>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {filteredGames.map((game) => (
              <TouchableOpacity
                key={game.id}
                onPress={() => router.push(`/game/${game.id}`)}
                style={{ backgroundColor: colors.surface, borderRadius: 14, overflow: 'hidden', borderWidth: 0.5, borderColor: colors.borderStrong }}
              >
                <View style={{ height: 160, backgroundColor: getGameImageColor(game), alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{ position: 'absolute', top: 10, left: 10 }}>
                    <BadgePill game={game} />
                  </View>
                  <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 0.5, borderColor: '#444' }}>
                    <Text style={{ color: '#ccc', fontSize: 10 }}>{game.sport}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => unsave(game.id)}
                    style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20, padding: 6, borderWidth: 0.5, borderColor: '#444' }}
                  >
                    <Ionicons name="heart" size={16} color={colors.accent} />
                  </TouchableOpacity>
                  <View style={{ position: 'absolute', bottom: 0, left: 0, right: 48, padding: 10, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <Text style={{ fontSize: 15, fontWeight: '500', color: '#fff' }}>{game.title}</Text>
                    <Text style={{ fontSize: 11, color: '#aaa' }}>{formatVenueLabel(game)}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderTopWidth: 0.5, borderTopColor: colors.border }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
                    <Text style={{ fontSize: 11, color: colors.textSecondary }}>{formatGameDate(game)}</Text>
                    <Text style={{ color: '#444' }}>·</Text>
                    <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
                    <Text style={{ fontSize: 11, color: colors.textSecondary }}>{game.startTime}</Text>
                    <Text style={{ color: '#444' }}>·</Text>
                    <Text style={{ fontSize: 11, color: colors.accent }}>{game.price}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {SAVED_META[game.id] && (
                      <Text style={{ fontSize: 11, color: colors.textMuted }}>Saved {SAVED_META[game.id].savedAt}</Text>
                    )}
                    <SkillMatch score={getSkillMatch(game.id)} compact />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  )
}
