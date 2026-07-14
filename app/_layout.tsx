import { Stack } from 'expo-router'
import { colors } from '../src/theme'

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="game/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="search" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  )
}
