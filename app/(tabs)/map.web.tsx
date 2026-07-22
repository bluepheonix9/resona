import { Text, View } from 'react-native'
import { colors } from '../../src/theme'

// react-native-maps is native-only and breaks the web bundle, so the web
// build gets this placeholder instead of the real map route.
export default function MapWebScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <Text style={{ fontSize: 15, fontWeight: '500', color: colors.textPrimary, marginBottom: 6 }}>Map unavailable on web</Text>
      <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: 'center' }}>Open the app on iOS or Android to browse games on the map.</Text>
    </View>
  )
}
