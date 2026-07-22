import type { Game } from '../types/game'

// Keep the demo feeling live: anchor every game's date to "now" so the
// Today / This week / Weekend tabs always have real content, whenever the app
// is opened. `startTime` stays a human label; only the day slides.
export function relativeISO(daysFromToday: number, hour: number, minute = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + daysFromToday)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

// Days from today until the next occurrence of a weekday (0=Sun … 6=Sat).
export function daysUntilWeekday(target: number): number {
  const today = new Date().getDay()
  return (target - today + 7) % 7
}

const SATURDAY = 6
const SUNDAY = 0

export const MOCK_GAMES: Game[] = [
  {
    id: '1',
    title: '3v3 Basketball — Bondi',
    sport: 'Basketball',
    difficulty: 'intermediate',
    tags: ['Outdoor', 'Casual', 'Bring a ball'],
    venue: { name: 'Bondi Skate Park Courts', area: 'Bondi', lat: -33.8915, lng: 151.2767 },
    startsAt: relativeISO(0, 18, 0),
    startTime: 'Starts 6pm',
    price: 'Free',
    status: 'live',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68711109d298?w=400&h=160&fit=crop',
    imageFallback: '#0a0f1a',
    spots: 6,
    spotsLeft: 2,
    featured: true,
  },
  {
    id: '2',
    title: 'Sunday Soccer — Centennial',
    sport: 'Soccer',
    difficulty: 'intermediate',
    tags: ['Outdoor', 'Teams assigned', 'Bring boots'],
    venue: { name: 'Centennial Park Field 3', area: 'Centennial Park', lat: -33.8988, lng: 151.2325 },
    startsAt: relativeISO(daysUntilWeekday(SATURDAY), 10, 0),
    startTime: 'Starts 10am',
    price: '$5',
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&h=160&fit=crop',
    imageFallback: '#0a1a0f',
    spots: 14,
    spotsLeft: 6,
    featured: true,
  },
  {
    id: '3',
    title: 'Beach Volleyball — Manly',
    sport: 'Volleyball',
    difficulty: 'beginner',
    tags: ['Beach', 'Casual', 'Social'],
    venue: { name: 'Manly Beach Courts', area: 'Manly', lat: -33.7969, lng: 151.2876 },
    startsAt: relativeISO(0, 15, 0),
    startTime: 'Starts 3pm',
    price: 'Free',
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=160&fit=crop',
    imageFallback: '#1a140a',
    spots: 8,
    spotsLeft: 4,
  },
  {
    id: '4',
    title: 'Tennis Round Robin — Newtown',
    sport: 'Tennis',
    difficulty: 'advanced',
    tags: ['Court', 'Competitive-ish', 'Racket needed'],
    venue: { name: 'Camperdown Memorial Park', area: 'Newtown', lat: -33.8977, lng: 151.1785 },
    startsAt: relativeISO(daysUntilWeekday(SUNDAY), 8, 0),
    startTime: 'Starts 8am',
    price: '$8',
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34c8?w=400&h=160&fit=crop',
    imageFallback: '#14001a',
    spots: 8,
    spotsLeft: 3,
  },
  {
    id: '5',
    title: 'Touch Footy — Rushcutters',
    sport: 'Touch Footy',
    difficulty: 'beginner',
    tags: ['Outdoor', 'No tackle', 'Social'],
    venue: { name: 'Rushcutters Bay Park', area: 'Rushcutters Bay', lat: -33.8732, lng: 151.2301 },
    startsAt: relativeISO(0, 17, 30),
    startTime: 'Starts 5:30pm',
    price: 'Free',
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=160&fit=crop',
    imageFallback: '#1a0a0a',
    spots: 12,
    spotsLeft: 7,
    featured: true,
  },
  {
    id: '6',
    title: 'Netball Social — Alexandria',
    sport: 'Netball',
    difficulty: 'beginner',
    tags: ['Indoor', 'Social', 'Casual'],
    venue: { name: 'Alexandria Basketball Stadium', area: 'Alexandria', lat: -33.9075, lng: 151.1937 },
    startsAt: relativeISO(-2, 19, 0),
    startTime: 'Started 7pm',
    price: '$6',
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1518611505868-d7b87081b695?w=400&h=160&fit=crop',
    imageFallback: '#0a1414',
    spots: 10,
    spotsLeft: 0,
  },
  {
    id: '7',
    title: 'Sunset Run Club — Bay Run',
    sport: 'Running',
    difficulty: 'intermediate',
    tags: ['Outdoor', 'Social'],
    venue: { name: 'Bay Run Loop', area: 'Rozelle', lat: -33.8663, lng: 151.1706 },
    startsAt: relativeISO(-6, 17, 30),
    startTime: 'Started 5:30pm',
    price: 'Free',
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1552674605-5defe6aa44bb?w=400&h=160&fit=crop',
    imageFallback: '#14140a',
    spots: 30,
    spotsLeft: 12,
  },
]
