import { useSyncExternalStore } from 'react'
import type { Game } from '../types/game'
import type { Profile } from '../types/profile'

// Lightweight app store for the demo core loop — saves and joins that stay in
// sync across the Home feed, game detail, and the Saved tab. Dependency-free:
// a tiny external store read through React's useSyncExternalStore. Swap the
// internals for Zustand + AsyncStorage / a real backend later without touching
// call sites.

type StoreState = {
  savedIds: string[]
  joinedIds: string[]
  // null until the user creates their profile.
  profile: Profile | null
  hostedGames: Game[]
}

// Seed a few saved games so the Saved tab isn't empty on first launch.
let state: StoreState = {
  savedIds: ['2', '3', '1'],
  joinedIds: [],
  profile: null,
  hostedGames: [],
}

const listeners = new Set<() => void>()

function setState(next: Partial<StoreState>) {
  state = { ...state, ...next }
  listeners.forEach((listener) => listener())
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

export function useProfile(): Profile | null {
  return useSyncExternalStore(
    subscribe,
    () => state.profile,
    () => state.profile,
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

// ---- Derived helpers ----

// Once you've grabbed a spot, reflect it in the count everywhere.
export function effectiveSpotsLeft(game: Game, joined: boolean): number {
  return Math.max(0, game.spotsLeft - (joined ? 1 : 0))
}
