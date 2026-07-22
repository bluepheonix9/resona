import { Stack } from 'expo-router'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { AuthProvider, useAuth } from '../src/lib/auth'
import { loadStateFromStorage } from '../src/lib/store'
import { colors } from '../src/theme'

function RootNavigator() {
  const { session, loading } = useAuth()

  React.useEffect(() => {
    loadStateFromStorage()
  }, [])

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    )
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      {session ? (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="game/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="search" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="edit-profile" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="host-game" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="pick-venue" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="+not-found" />
        </>
      ) : (
        <Stack.Screen name="sign-in" />
      )}
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  )
}
