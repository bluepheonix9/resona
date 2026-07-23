import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Marker, type Region } from 'react-native-maps'
import Supercluster from 'supercluster'
import { Difficulty } from '../../src/components/Difficulty'
import { formatVenueLabel, getGameById, getGameImageColor, getGamesForMap } from '../../src/lib/games'
import { useRemoteGames } from '../../src/lib/store'
import { colors } from '../../src/theme'
import type { Game, GameStatus } from '../../src/types/game'

const SYDNEY_REGION: Region = {
  latitude: -33.8885,
  longitude: 151.195,
  latitudeDelta: 0.16,
  longitudeDelta: 0.16,
}

type PointProps = { gameId: string }

function markerColor(status: GameStatus) {
  if (status === 'live') return colors.live
  if (status === 'upcoming') return colors.accent
  return colors.textSecondary
}

function regionToBBox(r: Region): [number, number, number, number] {
  return [
    r.longitude - r.longitudeDelta / 2,
    r.latitude - r.latitudeDelta / 2,
    r.longitude + r.longitudeDelta / 2,
    r.latitude + r.latitudeDelta / 2,
  ]
}

function regionToZoom(r: Region): number {
  return Math.round(Math.log2(360 / Math.max(r.longitudeDelta, 0.0001)))
}

function BadgePill({ status }: { status: GameStatus }) {
  if (status === 'live') {
    return (
      <View style={{ backgroundColor: colors.live, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
        <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>● In progress</Text>
      </View>
    )
  }
  if (status === 'upcoming') {
    return (
      <View style={{ backgroundColor: colors.accent, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
        <Text style={{ color: colors.accentDark, fontSize: 10, fontWeight: '600' }}>Upcoming</Text>
      </View>
    )
  }
  return (
    <View style={{ backgroundColor: 'transparent', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 0.5, borderColor: colors.accent }}>
      <Text style={{ color: colors.accent, fontSize: 10, fontWeight: '600' }}>Open to join</Text>
    </View>
  )
}

function GamePin({ game, selected }: { game: Game; selected: boolean }) {
  const pinColor = markerColor(game.status)
  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          backgroundColor: selected ? pinColor : colors.surface,
          borderRadius: 20,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderWidth: 1.5,
          borderColor: pinColor,
          minWidth: 36,
          alignItems: 'center',
        }}
      >
        <Ionicons name="basketball" size={14} color={selected ? colors.accentDark : pinColor} />
      </View>
      <View style={{ width: 2, height: 8, backgroundColor: pinColor, marginTop: -1 }} />
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: pinColor, marginTop: -1 }} />
    </View>
  )
}

function ClusterBubble({ count }: { count: number }) {
  const size = count < 10 ? 40 : count < 50 ? 48 : 56
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: 'rgba(200,241,53,0.18)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: size - 12,
            height: size - 12,
            borderRadius: (size - 12) / 2,
            backgroundColor: colors.accent,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: colors.accentDark, fontSize: 14, fontWeight: '700' }}>{count}</Text>
        </View>
      </View>
    </View>
  )
}

export default function MapScreen() {
  const mapRef = React.useRef<MapView>(null)
  const [region, setRegion] = React.useState<Region>(SYDNEY_REGION)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const remote = useRemoteGames()
  const mapGames = React.useMemo(() => getGamesForMap(remote), [remote])

  // Default the callout to the first game once games have loaded.
  React.useEffect(() => {
    if (selectedId === null && mapGames.length > 0) setSelectedId(mapGames[0].id)
  }, [mapGames, selectedId])

  const selectedGame = selectedId ? getGameById(selectedId) : undefined

  const index = React.useMemo(() => {
    const points: Supercluster.PointFeature<PointProps>[] = mapGames.map((game) => ({
      type: 'Feature',
      properties: { gameId: game.id },
      geometry: { type: 'Point', coordinates: [game.venue.lng, game.venue.lat] },
    }))
    return new Supercluster<PointProps>({ radius: 60, maxZoom: 16 }).load(points)
  }, [mapGames])

  const clusters = React.useMemo(
    () => index.getClusters(regionToBBox(region), regionToZoom(region)),
    [index, region],
  )

  function selectGame(game: Game) {
    setSelectedId(game.id)
    mapRef.current?.animateToRegion(
      { latitude: game.venue.lat, longitude: game.venue.lng, latitudeDelta: 0.05, longitudeDelta: 0.05 },
      350,
    )
  }

  function expandCluster(clusterId: number, lat: number, lng: number) {
    const zoom = Math.min(index.getClusterExpansionZoom(clusterId), 16)
    const delta = 360 / Math.pow(2, zoom)
    mapRef.current?.animateToRegion(
      { latitude: lat, longitude: lng, latitudeDelta: delta, longitudeDelta: delta },
      350,
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />

      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={SYDNEY_REGION}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton={false}
        userInterfaceStyle="dark"
      >
        {clusters.map((feature) => {
          const [lng, lat] = feature.geometry.coordinates
          const props = feature.properties as Supercluster.ClusterProperties & PointProps

          if (props.cluster) {
            return (
              <Marker
                key={`cluster-${props.cluster_id}`}
                coordinate={{ latitude: lat, longitude: lng }}
                onPress={() => expandCluster(props.cluster_id, lat, lng)}
                tracksViewChanges={Platform.OS === 'android'}
              >
                <ClusterBubble count={props.point_count} />
              </Marker>
            )
          }

          const game = getGameById(props.gameId)
          if (!game) return null
          return (
            <Marker
              key={`game-${game.id}`}
              coordinate={{ latitude: lat, longitude: lng }}
              onPress={() => selectGame(game)}
              tracksViewChanges={Platform.OS === 'android'}
            >
              <GamePin game={game} selected={selectedId === game.id} />
            </Marker>
          )
        })}
      </MapView>

      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          paddingTop: 56,
          paddingBottom: 12,
          paddingHorizontal: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(14,14,14,0.85)',
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border,
        }}
      >
        <View>
          <Text style={{ fontSize: 26, fontWeight: '500', color: colors.textPrimary }}>
            pickup<Text style={{ color: colors.accent }}>.</Text>
          </Text>
          <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
            {mapGames.length} games nearby
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => mapRef.current?.animateToRegion(SYDNEY_REGION, 400)}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 8,
            borderWidth: 0.5,
            borderColor: colors.borderStrong,
          }}
        >
          <Ionicons name="locate-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {selectedGame && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push(`/game/${selectedGame.id}`)}
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            backgroundColor: colors.surface,
            borderRadius: 14,
            overflow: 'hidden',
            borderWidth: 0.5,
            borderColor: colors.borderStrong,
          }}
        >
          <View style={{ height: 100, backgroundColor: getGameImageColor(selectedGame), justifyContent: 'flex-end', padding: 12 }}>
            <View style={{ position: 'absolute', top: 10, left: 10 }}>
              <BadgePill status={selectedGame.status} />
            </View>
            <View
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: 20,
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderWidth: 0.5,
                borderColor: '#444',
              }}
            >
              <Text style={{ color: '#ccc', fontSize: 10 }}>{selectedGame.sport}</Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff' }}>{selectedGame.title}</Text>
            <Text style={{ fontSize: 11, color: '#aaa' }}>{formatVenueLabel(selectedGame)}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 10,
              borderTopWidth: 0.5,
              borderTopColor: colors.border,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
              <Text style={{ fontSize: 11, color: colors.textSecondary }}>{selectedGame.startTime}</Text>
              <Text style={{ color: '#444' }}>·</Text>
              <Text style={{ fontSize: 11, color: colors.accent }}>{selectedGame.price}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Difficulty level={selectedGame.difficulty} compact />
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  )
}
