import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { daysUntilWeekday, relativeISO } from '../src/data/mockGames'
import { getAreas, getBrowseTags, getSports } from '../src/lib/games'
import { addHostedGame } from '../src/lib/store'
import { colors } from '../src/theme'
import type { Difficulty, Game } from '../src/types/game'

const SATURDAY = 6

type DateChoice = 'today' | 'tomorrow' | 'weekend'

const DATE_CHIPS: { key: DateChoice; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'weekend', label: 'This weekend' },
]

const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced']

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function daysFromToday(choice: DateChoice): number {
  if (choice === 'today') return 0
  if (choice === 'tomorrow') return 1
  return daysUntilWeekday(SATURDAY)
}

// Loose "6pm" / "6:30 PM" / "18:00" parse; null when it doesn't look like a time.
function parseTime(raw: string): { hour: number; minute: number } | null {
  const m = raw.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i)
  if (!m) return null
  let hour = parseInt(m[1], 10)
  const minute = m[2] ? parseInt(m[2], 10) : 0
  const meridiem = m[3]?.toLowerCase()
  if (hour > 23 || minute > 59) return null
  if (meridiem === 'pm' && hour < 12) hour += 12
  if (meridiem === 'am' && hour === 12) hour = 0
  return { hour, minute }
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: selected ? colors.accent : colors.surface2,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: selected ? colors.accent : colors.borderStrong,
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: '500', color: selected ? colors.accentDark : colors.textSecondary }}>{label}</Text>
    </TouchableOpacity>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 22 }}>
      <Text style={{ fontSize: 11, color: colors.textMuted, letterSpacing: 0.8, marginBottom: 10 }}>{title}</Text>
      {children}
    </View>
  )
}

function Field(props: {
  value: string
  onChangeText: (text: string) => void
  placeholder: string
  keyboardType?: 'number-pad'
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface2,
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 0.5,
        borderColor: colors.borderStrong,
      }}
    >
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={props.keyboardType}
        style={{ flex: 1, fontSize: 14, color: colors.textPrimary, paddingVertical: 12 }}
      />
    </View>
  )
}

export default function HostGameScreen() {
  const [sport, setSport] = React.useState('')
  const [title, setTitle] = React.useState('')
  const [titleEdited, setTitleEdited] = React.useState(false)
  const [venueName, setVenueName] = React.useState('')
  const [area, setArea] = React.useState('')
  const [dateChoice, setDateChoice] = React.useState<DateChoice | null>(null)
  const [time, setTime] = React.useState('')
  const [spots, setSpots] = React.useState('')
  const [priceMode, setPriceMode] = React.useState<'free' | 'paid' | null>(null)
  const [priceAmount, setPriceAmount] = React.useState('')
  const [difficulty, setDifficulty] = React.useState<Difficulty | null>(null)
  const [tags, setTags] = React.useState<string[]>([])

  const canPost =
    sport !== '' &&
    area !== '' &&
    dateChoice !== null &&
    time.trim() !== '' &&
    spots.trim() !== '' &&
    priceMode !== null &&
    difficulty !== null

  function autoTitle(nextSport: string, nextArea: string) {
    if (!titleEdited && nextSport && nextArea) setTitle(`${nextSport} — ${nextArea}`)
  }

  function toggleTag(tag: string) {
    setTags((current) => (current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]))
  }

  function post() {
    if (!canPost || !dateChoice || !difficulty) return
    const parsed = parseTime(time)
    const trimmedTime = time.trim()
    const game: Game = {
      id: Date.now().toString(),
      title: title.trim() || `${sport} — ${area}`,
      sport,
      difficulty,
      tags,
      venue: { name: venueName.trim() || 'TBC', area, lat: 0, lng: 0 },
      startsAt: relativeISO(daysFromToday(dateChoice), parsed?.hour ?? 18, parsed?.minute ?? 0),
      startTime: trimmedTime ? `Starts ${trimmedTime}` : 'Starts 6pm',
      price: priceMode === 'free' ? 'Free' : priceAmount.trim() || '$?',
      status: 'open',
      imageFallback: '#1A1A1A',
      spots: parseInt(spots, 10) || 10,
      spotsLeft: parseInt(spots, 10) || 10,
      featured: false,
    }
    addHostedGame(game)
    router.back()
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />

      <View style={{ paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>Cancel</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary }}>Host a game</Text>
        <TouchableOpacity onPress={post} disabled={!canPost} hitSlop={8}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: canPost ? colors.accent : colors.textMuted }}>Post</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Section title="SPORT">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {getSports().map((s) => (
                <Chip
                  key={s}
                  label={s}
                  selected={sport === s}
                  onPress={() => {
                    setSport(s)
                    autoTitle(s, area)
                  }}
                />
              ))}
            </ScrollView>
          </Section>

          <Section title="TITLE">
            <Field
              value={title}
              onChangeText={(text) => {
                setTitle(text)
                setTitleEdited(true)
              }}
              placeholder="e.g. 3v3 Basketball — Bondi"
            />
          </Section>

          <Section title="VENUE NAME">
            <Field value={venueName} onChangeText={setVenueName} placeholder="e.g. Bondi Skate Park Courts" />
          </Section>

          <Section title="AREA">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {getAreas().map((a) => (
                <Chip
                  key={a}
                  label={a}
                  selected={area === a}
                  onPress={() => {
                    setArea(a)
                    autoTitle(sport, a)
                  }}
                />
              ))}
            </View>
          </Section>

          <Section title="DATE">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {DATE_CHIPS.map((chip) => (
                <Chip key={chip.key} label={chip.label} selected={dateChoice === chip.key} onPress={() => setDateChoice(chip.key)} />
              ))}
            </View>
          </Section>

          <Section title="TIME">
            <Field value={time} onChangeText={setTime} placeholder="e.g. 6:00 PM" />
          </Section>

          <Section title="SPOTS">
            <Field value={spots} onChangeText={setSpots} placeholder="e.g. 10" keyboardType="number-pad" />
          </Section>

          <Section title="PRICE">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: priceMode === 'paid' ? 10 : 0 }}>
              <Chip label="Free" selected={priceMode === 'free'} onPress={() => setPriceMode('free')} />
              <Chip label="Paid →" selected={priceMode === 'paid'} onPress={() => setPriceMode('paid')} />
            </View>
            {priceMode === 'paid' && <Field value={priceAmount} onChangeText={setPriceAmount} placeholder="$5" />}
          </Section>

          <Section title="DIFFICULTY">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {DIFFICULTIES.map((level) => (
                <Chip key={level} label={cap(level)} selected={difficulty === level} onPress={() => setDifficulty(level)} />
              ))}
            </View>
          </Section>

          <Section title="TAGS (OPTIONAL)">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {getBrowseTags().map((tag) => (
                <Chip key={tag} label={tag} selected={tags.includes(tag)} onPress={() => toggleTag(tag)} />
              ))}
            </View>
          </Section>

          <TouchableOpacity
            onPress={post}
            disabled={!canPost}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              backgroundColor: canPost ? colors.accent : colors.surface2,
              borderRadius: 12,
              paddingVertical: 14,
              borderWidth: 0.5,
              borderColor: canPost ? colors.accent : colors.borderStrong,
            }}
          >
            <Ionicons name="megaphone-outline" size={18} color={canPost ? colors.accentDark : colors.textMuted} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: canPost ? colors.accentDark : colors.textMuted }}>
              {canPost ? 'Post game' : 'Fill in the required fields'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}
