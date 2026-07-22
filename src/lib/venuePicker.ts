// Bridges the host-game form and the /pick-venue map screen. host-game
// registers a callback and pushes the picker; the picker resolves it with the
// chosen coordinates on confirm. host-game stays mounted across the push, so
// its in-progress form state survives the round trip.

export type VenuePick = { lat: number; lng: number }

let pending: ((pick: VenuePick) => void) | null = null

export function requestVenuePick(onPick: (pick: VenuePick) => void) {
  pending = onPick
}

export function resolveVenuePick(pick: VenuePick) {
  const cb = pending
  pending = null
  cb?.(pick)
}
