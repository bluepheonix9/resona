import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Difficulty } from '../src/components/Difficulty'
import { formatVenueLabel, getGameImageColor, searchGames } from '../src/lib/games'
import { useRemoteGames } from '../src/lib/store'
import { colors } from '../src/theme'
import type { Game } from '../src/types/game'

const SUGGESTIONS = ['Basketball', 'Soccer', 'Free', 'Bondi', 'Beginner']

function ResultRow({ game }: { game: Game }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/game/${game.id}`)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 10,
        borderWidth: 0.5,
        borderColor: colors.borderStrong,
      }}
    >
      <View style={{ width: 52, height: 52, borderRadius: 8, backgroundColor: getGameImageColor(game) }} />
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary }}>{game.title}</Text>
        <Text numberOfLines={1} style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{formatVenueLabel(game)}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <Text style={{ fontSize: 11, color: colors.textSecondary }}>{game.startTime}</Text>
          <Text style={{ color: '#444' }}>·</Text>
          <Text style={{ fontSize: 11, color: colors.accent }}>{game.price}</Text>
        </View>
      </View>
      <Difficulty level={game.difficulty} compact />
    </TouchableOpacity>
  )
}

export default function SearchScreen() {
  const [query, setQuery] = React.useState('')
  const remote = useRemoteGames()
  const results = React.useMemo(() => searchGames(remote, query), [remote, query])
  const trimmed = query.trim()

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />

      {/* Search bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: colors.surface,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderWidth: 0.5,
            borderColor: colors.borderStrong,
          }}
        >
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            autoFocus
            placeholder="Search games, sports, venues..."
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
            style={{ flex: 1, fontSize: 14, color: colors.textPrimary }}
          />
          {trimmed.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {trimmed.length === 0 ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Text style={{ fontSize: 11, color: colors.textMuted, letterSpacing: 0.8, marginBottom: 12 }}>TRY SEARCHING FOR</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {SUGGESTIONS.map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setQuery(s)}
                style={{ backgroundColor: colors.surface, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 0.5, borderColor: colors.borderStrong }}
              >
                <Text style={{ fontSize: 13, color: colors.textSecondary }}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : results.length === 0 ? (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 32 }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surface, borderWidth: 0.5, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <Ionicons name="search-outline" size={24} color={colors.textMuted} />
          </View>
          <Text style={{ fontSize: 15, fontWeight: '500', color: colors.textPrimary, marginBottom: 6 }}>No games match "{trimmed}"</Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 }}>Try a sport, a venue, or an area like "Bondi".</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 10 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={{ fontSize: 11, color: colors.textMuted, letterSpacing: 0.8, marginBottom: 4 }}>
            {results.length} {results.length === 1 ? 'RESULT' : 'RESULTS'}
          </Text>
          {results.map((game) => <ResultRow key={game.id} game={game} />)}
        </ScrollView>
      )}
    </View>
  )
}
