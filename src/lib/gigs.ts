import { MOCK_GIGS } from '../data/mockGigs'
import type { Gig, GigFilters } from '../types/gig'

const AREA_GROUPS: Record<string, string[]> = {
  'Inner West': ['Marrickville', 'Newtown'],
  City: ['Chippendale', 'The Rocks'],
  East: ['Darlinghurst'],
  'Nth Beaches': [],
}

const BROWSE_GENRES = [
  'Garage rock',
  'Sad indie',
  'Heavy',
  'Dream pop',
  'Surf rock',
  'Jazz',
  'Electronic',
  'Folk',
]

const BROWSE_VIBES = ['Free entry', 'Late night', 'Small room', 'Outdoor', 'New bands', 'DJs']

function matchesArea(gig: Gig, area: string): boolean {
  if (area === 'All areas') return true
  const neighbourhoods = AREA_GROUPS[area]
  if (!neighbourhoods) return gig.venue.area === area
  return neighbourhoods.includes(gig.venue.area)
}

function applyFilters(gigs: Gig[], filters?: GigFilters): Gig[] {
  if (!filters) return gigs

  return gigs.filter((gig) => {
    if (filters.ids && !filters.ids.includes(gig.id)) return false
    if (filters.area && !matchesArea(gig, filters.area)) return false
    if (filters.genre && gig.genre !== filters.genre) return false
    if (filters.vibe && !gig.vibes.includes(filters.vibe)) return false
    if (filters.status && gig.status !== filters.status) return false
    if (filters.staffPick && !gig.staffPick) return false
    return true
  })
}

export function getGigs(filters?: GigFilters): Gig[] {
  return applyFilters(MOCK_GIGS, filters)
}

export function getGigById(id: string): Gig | undefined {
  return MOCK_GIGS.find((gig) => gig.id === id)
}

export function getGigsForMap(filters?: GigFilters): Gig[] {
  return getGigs(filters)
}

export function getStaffPicks(): Gig[] {
  return getGigs({ staffPick: true })
}

export function getBrowseGenres() {
  return BROWSE_GENRES.map((label) => ({
    id: label.toLowerCase().replace(/\s+/g, '-'),
    label,
    count: MOCK_GIGS.filter((gig) => gig.genre === label).length,
  }))
}

export function getBrowseVibes() {
  return BROWSE_VIBES
}

export function getVenues() {
  const venueMap = new Map<string, { id: string; name: string; area: string; gigs: number }>()

  for (const gig of MOCK_GIGS) {
    const key = gig.venue.name
    const existing = venueMap.get(key)
    if (existing) {
      existing.gigs += 1
    } else {
      venueMap.set(key, {
        id: key.toLowerCase().replace(/\s+/g, '-'),
        name: gig.venue.name,
        area: gig.venue.area,
        gigs: 1,
      })
    }
  }

  return Array.from(venueMap.values())
}

export function getGigImageColor(gig: Gig): string {
  return gig.imageFallback
}

export function formatVenueLabel(gig: Gig): string {
  return `${gig.venue.name}, ${gig.venue.area}`
}

export function formatGigDate(gig: Gig): string {
  return new Date(gig.startsAt).toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function formatGigDateLong(gig: Gig): string {
  return new Date(gig.startsAt).toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function isGigUpcoming(gig: Gig, now = new Date()): boolean {
  return new Date(gig.startsAt) >= now
}
