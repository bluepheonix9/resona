export type GameStatus = 'live' | 'upcoming' | 'open'

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
  skillLevel: string
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
  skillLevel?: string
  status?: GameStatus
  featured?: boolean
  ids?: string[]
}
