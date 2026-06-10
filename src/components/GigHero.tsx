import { View, Image } from 'react-native'
import type { Gig } from '../types/gig'
import { getGigImageColor } from '../lib/gigs'

type GigHeroProps = {
  gig: Gig
  height?: number
}

export function GigHero({ gig, height = 280 }: GigHeroProps) {
  if (gig.imageUrl) {
    return (
      <Image
        source={{ uri: gig.imageUrl }}
        style={{ width: '100%', height }}
        resizeMode="cover"
      />
    )
  }

  return <View style={{ width: '100%', height, backgroundColor: getGigImageColor(gig) }} />
}
