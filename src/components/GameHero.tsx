import { View, Image } from 'react-native'
import type { Game } from '../types/game'
import { getGameImageColor } from '../lib/games'

type GameHeroProps = {
  game: Game
  height?: number
}

export function GameHero({ game, height = 280 }: GameHeroProps) {
  if (game.imageUrl) {
    return (
      <Image
        source={{ uri: game.imageUrl }}
        style={{ width: '100%', height }}
        resizeMode="cover"
      />
    )
  }

  return <View style={{ width: '100%', height, backgroundColor: getGameImageColor(game) }} />
}
