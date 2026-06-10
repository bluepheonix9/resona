import React from 'react'
import { View, Text, TouchableOpacity, StatusBar, Platform } from 'react-native'
import { router } from 'expo-router'
import MapView, { Marker } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../src/theme'
import { TasteMatch } from '../../src/components/TasteMatch'
import { getTasteMatch } from '../../src/lib/tasteMatch'
import { formatVenueLabel, getGigImageColor, getGigsForMap } from '../../src/lib/gigs'
import type { Gig, GigStatus } from '../../src/types/gig'

const SYDNEY_REGION = {
  latitude: -33.8885,
  longitude: 151.195,
  latitudeDelta: 0.06,
  longitudeDelta: 0.06,
}

const MAP_GIGS = getGigsForMap()

function markerColor(status: GigStatus) {
  if (status === 'live') return colors.live
  if (status === 'tonight') return colors.accent
  return colors.textSecondary
}

function BadgePill({ status }: { status: GigStatus }) {
  if (status === 'live') {
    return (
      <View style={{ backgroundColor: colors.live, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
        <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>● Live now</Text>
      </View>
    )
  }
  if (status === 'tonight') {
    return (
      <View style={{ backgroundColor: colors.accent, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
        <Text style={{ color: colors.accentDark, fontSize: 10, fontWeight: '600' }}>Tonight</Text>
      </View>
    )
  }
  return (
    <View style={{ backgroundColor: 'transparent', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 0.5, borderColor: colors.accent }}>
      <Text style={{ color: colors.accent, fontSize: 10, fontWeight: '600' }}>Free entry</Text>
    </View>
  )
}

function GigPin({ gig, selected }: { gig: Gig; selected: boolean }) {
  const pinColor = markerColor(gig.status)
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
        <Ionicons name="musical-notes" size={14} color={selected ? colors.accentDark : pinColor} />
      </View>
      <View style={{ width: 2, height: 8, backgroundColor: pinColor, marginTop: -1 }} />
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: pinColor, marginTop: -1 }} />
    </View>
  )
}

export default function MapScreen() {
  const mapRef = React.useRef<MapView>(null)
  const [selectedId, setSelectedId] = React.useState<string | null>(MAP_GIGS[0]?.id ?? null)

  const selectedGig = MAP_GIGS.find((g) => g.id === selectedId)

  function selectGig(gig: Gig) {
    setSelectedId(gig.id)
    mapRef.current?.animateToRegion(
      {
        latitude: gig.venue.lat,
        longitude: gig.venue.lng,
        latitudeDelta: 0.025,
        longitudeDelta: 0.025,
      },
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
        showsUserLocation
        showsMyLocationButton={false}
        userInterfaceStyle="dark"
      >
        {MAP_GIGS.map((gig) => (
          <Marker
            key={gig.id}
            coordinate={{ latitude: gig.venue.lat, longitude: gig.venue.lng }}
            onPress={() => selectGig(gig)}
            tracksViewChanges={Platform.OS === 'android'}
          >
            <GigPin gig={gig} selected={selectedId === gig.id} />
          </Marker>
        ))}
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
            map<Text style={{ color: colors.accent }}>.</Text>
          </Text>
          <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
            {MAP_GIGS.length} gigs nearby
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

      {selectedGig && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push(`/gig/${selectedGig.id}`)}
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
          <View style={{ height: 100, backgroundColor: getGigImageColor(selectedGig), justifyContent: 'flex-end', padding: 12 }}>
            <View style={{ position: 'absolute', top: 10, left: 10 }}>
              <BadgePill status={selectedGig.status} />
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
              <Text style={{ color: '#ccc', fontSize: 10 }}>{selectedGig.genre}</Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff' }}>{selectedGig.band}</Text>
            <Text style={{ fontSize: 11, color: '#aaa' }}>{formatVenueLabel(selectedGig)}</Text>
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
              <Text style={{ fontSize: 11, color: colors.textSecondary }}>{selectedGig.doorsTime}</Text>
              <Text style={{ color: '#444' }}>·</Text>
              <Text style={{ fontSize: 11, color: colors.accent }}>{selectedGig.price}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TasteMatch score={getTasteMatch(selectedGig.id)} compact />
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  )
}
