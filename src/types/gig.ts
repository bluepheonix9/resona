export type GigStatus = 'live' | 'tonight' | 'free'

export type Venue = {
  name: string
  area: string
  lat: number
  lng: number
}

export type Gig = {
  id: string
  band: string
  genre: string
  vibes: string[]
  venue: Venue
  startsAt: string
  doorsTime: string
  price: string
  status: GigStatus
  imageUrl?: string
  imageFallback: string
  interested?: number
  staffPick?: boolean
}

export type GigFilters = {
  area?: string
  genre?: string
  vibe?: string
  status?: GigStatus
  staffPick?: boolean
  ids?: string[]
}
