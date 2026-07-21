import { Stack } from 'expo-router'
import React from 'react'
import { loadStateFromStorage } from '../src/lib/store'
import { colors } from '../src/theme'

export default function RootLayout() {
  React.useEffect(() => {
    loadStateFromStorage()
  }, [])

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="game/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="search" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="edit-profile" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="host-game" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="pick-venue" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  )
}
