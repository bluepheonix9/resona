import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { getAreas, getSports } from '../src/lib/games'
import { saveProfile, useProfile } from '../src/lib/store'
import { colors } from '../src/theme'
import type { Difficulty } from '../src/types/game'
import type { Profile } from '../src/types/profile'

const AVATAR_EMOJI = ['🏀', '⚽', '🎾', '🏐', '🏉', '🏸', '🏃', '🔥', '😎', '👟']
const SKILL_LEVELS: Difficulty[] = ['beginner', 'intermediate', 'advanced']

const BLANK: Profile = {
  displayName: '',
  handle: '',
  bio: '',
  homeArea: '',
  favoriteSports: [],
  skillLevel: 'beginner',
  avatarEmoji: '',
}

// Handles are stored bare (no @) — keep them url/username-ish.
function normalizeHandle(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20)
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
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
  multiline?: boolean
  prefix?: string
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: props.multiline ? 'flex-start' : 'center',
        backgroundColor: colors.surface2,
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 0.5,
        borderColor: colors.borderStrong,
      }}
    >
      {props.prefix && <Text style={{ fontSize: 14, color: colors.textMuted, marginRight: 2 }}>{props.prefix}</Text>}
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={props.multiline}
        style={{
          flex: 1,
          fontSize: 14,
          color: colors.textPrimary,
          paddingVertical: 12,
          minHeight: props.multiline ? 88 : undefined,
          textAlignVertical: props.multiline ? 'top' : undefined,
        }}
      />
    </View>
  )
}

export default function EditProfileScreen() {
  const existing = useProfile()
  const [draft, setDraft] = React.useState<Profile>(existing ?? BLANK)

  const canSave = draft.displayName.trim().length > 0

  function toggleSport(sport: string) {
    setDraft((d) => ({
      ...d,
      favoriteSports: d.favoriteSports.includes(sport)
        ? d.favoriteSports.filter((s) => s !== sport)
        : [...d.favoriteSports, sport],
    }))
  }

  function save() {
    if (!canSave) return
    saveProfile({ ...draft, displayName: draft.displayName.trim(), bio: draft.bio.trim() })
    router.back()
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />

      {/* Header: Cancel / title / Save */}
      <View style={{ paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>Cancel</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary }}>
          {existing ? 'Edit profile' : 'Create profile'}
        </Text>
        <TouchableOpacity onPress={save} disabled={!canSave} hitSlop={8}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: canSave ? colors.accent : colors.textMuted }}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Section title="AVATAR">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <TouchableOpacity
                onPress={() => setDraft((d) => ({ ...d, avatarEmoji: '' }))}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: colors.accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: draft.avatarEmoji === '' ? '#fff' : 'transparent',
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.accentDark }}>Aa</Text>
              </TouchableOpacity>
              {AVATAR_EMOJI.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  onPress={() => setDraft((d) => ({ ...d, avatarEmoji: emoji }))}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: colors.surface2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: draft.avatarEmoji === emoji ? colors.accent : colors.borderStrong,
                  }}
                >
                  <Text style={{ fontSize: 20 }}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 8 }}>
              Pick an emoji, or "Aa" to use your initials.
            </Text>
          </Section>

          <Section title="NAME">
            <Field
              value={draft.displayName}
              onChangeText={(displayName) => setDraft((d) => ({ ...d, displayName }))}
              placeholder="Your name"
            />
          </Section>

          <Section title="USERNAME">
            <Field
              value={draft.handle}
              onChangeText={(raw) => setDraft((d) => ({ ...d, handle: normalizeHandle(raw) }))}
              placeholder="username"
              prefix="@"
            />
          </Section>

          <Section title="BIO">
            <Field
              value={draft.bio}
              onChangeText={(bio) => setDraft((d) => ({ ...d, bio }))}
              placeholder="A line or two about how you play..."
              multiline
            />
          </Section>

          <Section title="HOME AREA">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {getAreas().map((area) => (
                <Chip
                  key={area}
                  label={area}
                  selected={draft.homeArea === area}
                  onPress={() => setDraft((d) => ({ ...d, homeArea: d.homeArea === area ? '' : area }))}
                />
              ))}
            </View>
          </Section>

          <Section title="FAVORITE SPORTS">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {getSports().map((sport) => (
                <Chip key={sport} label={sport} selected={draft.favoriteSports.includes(sport)} onPress={() => toggleSport(sport)} />
              ))}
            </View>
          </Section>

          <Section title="SKILL LEVEL">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {SKILL_LEVELS.map((level) => (
                <Chip key={level} label={cap(level)} selected={draft.skillLevel === level} onPress={() => setDraft((d) => ({ ...d, skillLevel: level }))} />
              ))}
            </View>
          </Section>

          <TouchableOpacity
            onPress={save}
            disabled={!canSave}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              backgroundColor: canSave ? colors.accent : colors.surface2,
              borderRadius: 12,
              paddingVertical: 14,
              borderWidth: 0.5,
              borderColor: canSave ? colors.accent : colors.borderStrong,
            }}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color={canSave ? colors.accentDark : colors.textMuted} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: canSave ? colors.accentDark : colors.textMuted }}>
              {canSave ? 'Save profile' : 'Add your name to save'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}
