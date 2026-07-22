import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Marker, type LatLng, type Region } from 'react-native-maps'
import { resolveVenuePick } from '../src/lib/venuePicker'
import { colors } from '../src/theme'

const SYDNEY_REGION: Region = {
  latitude: -33.8885,
  longitude: 151.195,
  latitudeDelta: 0.16,
  longitudeDelta: 0.16,
}

export default function PickVenueScreen() {
  const [pin, setPin] = React.useState<LatLng>({
    latitude: SYDNEY_REGION.latitude,
    longitude: SYDNEY_REGION.longitude,
  })

  function confirm() {
    resolveVenuePick({ lat: pin.latitude, lng: pin.longitude })
    router.back()
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />

      <MapView
        style={{ flex: 1 }}
        initialRegion={SYDNEY_REGION}
        onPress={(e) => setPin(e.nativeEvent.coordinate)}
        showsUserLocation
        showsMyLocationButton={false}
        userInterfaceStyle="dark"
      >
        <Marker
          coordinate={pin}
          draggable
          onDragEnd={(e) => setPin(e.nativeEvent.coordinate)}
          tracksViewChanges={Platform.OS === 'android'}
        >
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: colors.accent,
                borderRadius: 20,
                padding: 8,
                borderWidth: 1.5,
                borderColor: colors.accentDark,
              }}
            >
              <Ionicons name="location" size={18} color={colors.accentDark} />
            </View>
            <View style={{ width: 2, height: 8, backgroundColor: colors.accent, marginTop: -1 }} />
          </View>
        </Marker>
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
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>Cancel</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary }}>Pick venue</Text>
        <View style={{ width: 48 }} />
      </View>

      <View style={{ position: 'absolute', bottom: 24, left: 16, right: 16, gap: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'rgba(14,14,14,0.85)',
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderWidth: 0.5,
            borderColor: colors.borderStrong,
          }}
        >
          <Ionicons name="pin-outline" size={16} color={colors.textSecondary} />
          <Text style={{ fontSize: 13, color: colors.textSecondary }}>
            Tap or drag the pin — {pin.latitude.toFixed(4)}, {pin.longitude.toFixed(4)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={confirm}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            backgroundColor: colors.accent,
            borderRadius: 12,
            paddingVertical: 14,
          }}
        >
          <Ionicons name="checkmark" size={18} color={colors.accentDark} />
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.accentDark }}>Use this location</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
