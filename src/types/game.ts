export type GameStatus = 'live' | 'upcoming' | 'open'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type Venue = {
  name: string
  area: string
  lat: number
  lng: number
}

export type Organizer = {
  name: string
  avatarEmoji: string
}

export type Game = {
  id: string
  title: string
  sport: string
  difficulty: Difficulty
  tags: string[]
  venue: Venue
  startsAt: string
  startTime: string
  price: string
  status: GameStatus
  imageUrl?: string
  imageFallback: string
  spots: number
  spotsLeft: number
  featured?: boolean
  // Present on games created in-app; stamped from the host's profile.
  organizer?: Organizer
  // Auth user id of the host, for games that live in Supabase. Absent on the
  // local demo seed (MOCK_GAMES).
  hostId?: string
}

export type TimeWindow = 'today' | 'upcoming' | 'past'

export type PriceFilter = 'free' | 'paid'

export type GameFilters = {
  area?: string
  sport?: string
  difficulty?: Difficulty
  status?: GameStatus
  featured?: boolean
  ids?: string[]
  when?: TimeWindow
  tag?: string
  price?: PriceFilter
}
