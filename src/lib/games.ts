import { MOCK_GAMES } from '../data/mockGames'
import type { Game, GameFilters } from '../types/game'

const BROWSE_SPORTS = [
  'Basketball',
  'Soccer',
  'Volleyball',
  'Tennis',
  'Touch Footy',
  'Netball',
  'Cricket',
  'Running',
]

const BROWSE_TAGS = ['Outdoor', 'Casual', 'Social', 'Beach', 'Court', 'Beginner friendly']

function applyFilters(games: Game[], filters?: GameFilters): Game[] {
  if (!filters) return games

  return games.filter((game) => {
    if (filters.ids && !filters.ids.includes(game.id)) return false
    if (filters.area && filters.area !== 'All areas' && game.venue.area !== filters.area) return false
    if (filters.sport && filters.sport !== 'All sports' && game.sport !== filters.sport) return false
    if (filters.skillLevel && game.skillLevel !== filters.skillLevel) return false
    if (filters.status && game.status !== filters.status) return false
    if (filters.featured && !game.featured) return false
    return true
  })
}

export function getGames(filters?: GameFilters): Game[] {
  return applyFilters(MOCK_GAMES, filters)
}

export function getGameById(id: string): Game | undefined {
  return MOCK_GAMES.find((game) => game.id === id)
}

export function getGamesForMap(filters?: GameFilters): Game[] {
  return getGames(filters)
}

export function getFeaturedGames(): Game[] {
  return getGames({ featured: true })
}

export function getBrowseSports() {
  return BROWSE_SPORTS.map((label) => ({
    id: label.toLowerCase().replace(/\s+/g, '-'),
    label,
    count: MOCK_GAMES.filter((game) => game.sport === label).length,
  }))
}

export function getBrowseTags() {
  return BROWSE_TAGS
}

export function getVenues() {
  const venueMap = new Map<string, { id: string; name: string; area: string; games: number }>()

  for (const game of MOCK_GAMES) {
    const key = game.venue.name
    const existing = venueMap.get(key)
    if (existing) {
      existing.games += 1
    } else {
      venueMap.set(key, {
        id: key.toLowerCase().replace(/\s+/g, '-'),
        name: game.venue.name,
        area: game.venue.area,
        games: 1,
      })
    }
  }

  return Array.from(venueMap.values())
}

export function getGameImageColor(game: Game): string {
  return game.imageFallback
}

export function formatVenueLabel(game: Game): string {
  return `${game.venue.name}, ${game.venue.area}`
}

export function formatGameDate(game: Game): string {
  return new Date(game.startsAt).toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function formatGameDateLong(game: Game): string {
  return new Date(game.startsAt).toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function isGameUpcoming(game: Game, now = new Date()): boolean {
  return new Date(game.startsAt) >= now
}
