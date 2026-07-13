export type GameStatus = 'live' | 'upcoming' | 'open'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type Venue = {
  name: string
  area: string
  lat: number
  lng: number
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
}

export type GameFilters = {
  area?: string
  sport?: string
  difficulty?: Difficulty
  status?: GameStatus
  featured?: boolean
  ids?: string[]
}
