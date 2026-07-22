import { Tabs, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity, View } from 'react-native'
import { colors } from '../../src/theme'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="host"
        options={{
          title: '',
          tabBarButton: () => (
            <TouchableOpacity
              onPress={() => router.push('/host-game')}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
              accessibilityLabel="Host a game"
              accessibilityRole="button"
            >
              <View
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 29,
                  backgroundColor: colors.accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: -6,
                }}
              >
                <Ionicons name="add" size={30} color={colors.accentDark} />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}