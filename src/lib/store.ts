import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSyncExternalStore } from 'react'
import type { Game } from '../types/game'
import type { Message } from '../types/message'
import type { Profile } from '../types/profile'

// Lightweight app store for the demo core loop — saves and joins that stay in
// sync across the Home feed, game detail, and the Saved tab. Dependency-free
// on state management: a tiny external store read through
// useSyncExternalStore. hostedGames and profile are persisted to AsyncStorage
// so they survive app restarts; everything else is in-memory only for now.

type StoreState = {
  savedIds: string[]
  joinedIds: string[]
  // null until the user creates their profile.
  profile: Profile | null
  hostedGames: Game[]
  // Per-game chat threads, keyed by game id. In-memory only for now.
  gameChats: Record<string, Message[]>
}

// Seed a few saved games so the Saved tab isn't empty on first launch.
let state: StoreState = {
  savedIds: ['2', '3', '1'],
  joinedIds: [],
  profile: null,
  hostedGames: [],
  gameChats: {},
}

const listeners = new Set<() => void>()

function setState(next: Partial<StoreState>) {
  state = { ...state, ...next }
  listeners.forEach((listener) => listener())
  if ('hostedGames' in next || 'profile' in next) void persistState()
}

// ---- Persistence (AsyncStorage) ----

const STORAGE_KEY_HOSTED = 'pickup_hostedGames'
const STORAGE_KEY_PROFILE = 'pickup_profile'

async function persistState() {
  try {
    await AsyncStorage.multiSet([
      [STORAGE_KEY_HOSTED, JSON.stringify(state.hostedGames)],
      [STORAGE_KEY_PROFILE, JSON.stringify(state.profile)],
    ])
  } catch {
    // Best-effort: a failed write just means this change isn't persisted.
  }
}

export async function saveStateToStorage() {
  await persistState()
}

// Hydrate hostedGames and profile from disk. Corrupt or missing values fall
// back to the in-memory defaults. Call once on app startup.
export async function loadStateFromStorage() {
  try {
    const pairs = await AsyncStorage.multiGet([STORAGE_KEY_HOSTED, STORAGE_KEY_PROFILE])
    const stored = Object.fromEntries(pairs)
    const next: Partial<StoreState> = {}

    const rawHosted = stored[STORAGE_KEY_HOSTED]
    if (rawHosted) {
      const parsed = JSON.parse(rawHosted)
      if (Array.isArray(parsed)) next.hostedGames = parsed
    }

    const rawProfile = stored[STORAGE_KEY_PROFILE]
    if (rawProfile) {
      const parsed = JSON.parse(rawProfile)
      if (parsed && typeof parsed === 'object') next.profile = parsed
    }

    if (Object.keys(next).length > 0) setState(next)
  } catch {
    // Corrupt data → keep defaults.
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

// ---- Selectors (hooks) ----

export function useSavedIds(): string[] {
  return useSyncExternalStore(
    subscribe,
    () => state.savedIds,
    () => state.savedIds,
  )
}

export function useJoinedIds(): string[] {
  return useSyncExternalStore(
    subscribe,
    () => state.joinedIds,
    () => state.joinedIds,
  )
}

export function useIsSaved(id: string): boolean {
  return useSavedIds().includes(id)
}

export function useIsJoined(id: string): boolean {
  return useJoinedIds().includes(id)
}

export function useHostedGames(): Game[] {
  return useSyncExternalStore(
    subscribe,
    () => state.hostedGames,
    () => state.hostedGames,
  )
}

// Non-hook read for plain lib code (e.g. getGameById outside React).
export function getHostedGames(): Game[] {
  return state.hostedGames
}

export function useIsHosted(id: string): boolean {
  return useHostedGames().some((game) => game.id === id)
}

export function useProfile(): Profile | null {
  return useSyncExternalStore(
    subscribe,
    () => state.profile,
    () => state.profile,
  )
}

// Stable empty reference so an unread thread doesn't churn getSnapshot.
const EMPTY_MESSAGES: Message[] = []

export function useGameMessages(gameId: string): Message[] {
  return useSyncExternalStore(
    subscribe,
    () => state.gameChats[gameId] ?? EMPTY_MESSAGES,
    () => state.gameChats[gameId] ?? EMPTY_MESSAGES,
  )
}

// ---- Actions ----

export function toggleSaved(id: string) {
  const isSaved = state.savedIds.includes(id)
  setState({
    savedIds: isSaved
      ? state.savedIds.filter((savedId) => savedId !== id)
      : [id, ...state.savedIds],
  })
}

export function joinGame(id: string) {
  if (state.joinedIds.includes(id)) return
  setState({ joinedIds: [...state.joinedIds, id] })
}

export function leaveGame(id: string) {
  setState({ joinedIds: state.joinedIds.filter((joinedId) => joinedId !== id) })
}

export function addHostedGame(game: Game) {
  setState({ hostedGames: [game, ...state.hostedGames] })
}

export function updateHostedGame(id: string, patch: Partial<Game>) {
  setState({
    hostedGames: state.hostedGames.map((game) => (game.id === id ? { ...game, ...patch, id } : game)),
  })
}

// Cancel a hosted game and scrub any references so it stops resolving anywhere.
export function removeHostedGame(id: string) {
  const { [id]: _removed, ...remainingChats } = state.gameChats
  setState({
    hostedGames: state.hostedGames.filter((game) => game.id !== id),
    savedIds: state.savedIds.filter((savedId) => savedId !== id),
    joinedIds: state.joinedIds.filter((joinedId) => joinedId !== id),
    gameChats: remainingChats,
  })
}

// Blank slate merged under partial saves when no profile exists yet.
const EMPTY_PROFILE: Profile = {
  displayName: '',
  handle: '',
  bio: '',
  homeArea: '',
  favoriteSports: [],
  skillLevel: 'beginner',
  avatarEmoji: '',
}

// Create-or-update: merges the patch over the existing profile (or a blank
// one), so the editor can save the whole form or a single field.
export function saveProfile(patch: Partial<Profile>) {
  const base = state.profile ?? EMPTY_PROFILE
  setState({ profile: { ...base, ...patch } })
}

export function clearProfile() {
  setState({ profile: null })
}

// Append a message to a game's thread, stamped with the current profile
// (falling back to a guest identity when no profile exists yet).
export function sendGameMessage(gameId: string, text: string) {
  const body = text.trim()
  if (!body) return
  const profile = state.profile
  const message: Message = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    senderId: profile?.handle || 'me',
    senderName: profile?.displayName || 'You',
    avatarEmoji: profile?.avatarEmoji || '',
    text: body,
    timestamp: Date.now(),
  }
  const thread = state.gameChats[gameId] ?? EMPTY_MESSAGES
  setState({ gameChats: { ...state.gameChats, [gameId]: [...thread, message] } })
}

// ---- Derived helpers ----

// Once you've grabbed a spot, reflect it in the count everywhere.
export function effectiveSpotsLeft(game: Game, joined: boolean): number {
  return Math.max(0, game.spotsLeft - (joined ? 1 : 0))
}
