import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../src/theme'

export default function ActivityScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <Text style={styles.title}>Activity</Text>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: { backgroundColor: colors.background, borderBottomWidth: 2, borderBottomColor: colors.accent, padding: 18 },
  title: { fontSize: 24, color: colors.surface, fontWeight: '600' },
})