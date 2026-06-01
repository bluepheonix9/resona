import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../src/theme'

const RANKING_DATA = [
  { id: 1, name: 'Radiohead', genre: 'Art Rock', color: '#C8472B' },
  { id: 2, name: 'Slowdive', genre: 'Shoegaze', color: '#2563A8' },
  { id: 3, name: 'Portishead', genre: 'Trip-Hop', color: '#2A7A4B' },
  { id: 4, name: 'The National', genre: 'Indie Rock', color: '#7A3F9C' },
  { id: 5, name: 'Grouper', genre: 'Ambient Folk', color: '#1F6E6E' },
  { id: 6, name: 'Beach House', genre: 'Dream Pop', color: '#B36B1A' },
  { id: 7, name: 'Faye Webster', genre: 'Indie Pop', color: '#8B3A5C' },
  { id: 8, name: 'IDLES', genre: 'Post-Punk', color: '#185FA5' },
]

function ArtistTile({ name, color }: { name: string; color: string }) {
  return (
    <View style={[styles.artistTile, { backgroundColor: color }]}>
      <Text style={styles.artistTileText}>{name.charAt(0)}</Text>
    </View>
  )
}

function RankingItem({ rank, name, genre, color }: {
  rank: number; name: string; genre: string; color: string
}) {
  return (
    <View style={styles.rankingItem}>
      <Text style={[styles.rankNum, { color: rank <= 3 ? colors.accent2 : colors.textMuted }]}>
        {rank}
      </Text>
      <ArtistTile name={name} color={color} />
      <View style={styles.rankInfo}>
        <Text style={styles.rankName}>{name}</Text>
        <Text style={styles.rankGenre}>{genre}</Text>
      </View>
      <Text style={styles.dragHandle}>≡</Text>
    </View>
  )
}

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerTopRow}>
          <Text style={styles.logo}>resona<Text style={styles.logoDot}>.</Text></Text>
        </View>
        <View style={styles.profileTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>J</Text>
          </View>
          <View>
            <Text style={styles.profileName}>Jordan Morrow</Text>
            <Text style={styles.profileHandle}>@jxnmorrow</Text>
          </View>
        </View>
        <Text style={styles.profileBio}>
          deep cuts only. post-punk, dream pop, and the occasional guilty pleasure.
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>8</Text>
            <Text style={styles.statLabel}>Artists</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>14</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>91%</Text>
            <Text style={styles.statLabel}>Top match</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {RANKING_DATA.map((artist, index) => (
          <RankingItem
            key={artist.id}
            rank={index + 1}
            name={artist.name}
            genre={artist.genre}
            color={artist.color}
          />
        ))}
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add artist</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: { backgroundColor: colors.background, borderBottomWidth: 2, borderBottomColor: colors.accent, paddingHorizontal: 18, paddingBottom: 0 },
  headerTopRow: { paddingVertical: 12 },
  logo: { fontFamily: 'serif', fontSize: 24, color: colors.surface, fontStyle: 'italic' },
  logoDot: { color: colors.accent2 },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingBottom: 10 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 24, color: colors.white, fontWeight: '600' },
  profileName: { fontSize: 20, color: colors.surface, fontWeight: '600' },
  profileHandle: { fontSize: 12, color: 'rgba(245,240,232,0.45)', marginTop: 2 },
  profileBio: { fontSize: 12, color: 'rgba(245,240,232,0.55)', lineHeight: 18, paddingBottom: 12 },
  statsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingVertical: 12 },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 18, color: colors.surface, fontWeight: '600' },
  statLabel: { fontSize: 10, color: 'rgba(245,240,232,0.4)', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  content: { flex: 1 },
  contentInner: { padding: 14, paddingBottom: 32 },
  rankingItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, padding: 10, marginBottom: 6 },
  rankNum: { fontSize: 17, width: 22, textAlign: 'right', fontWeight: '500' },
  artistTile: { width: 38, height: 38, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  artistTileText: { fontSize: 16, color: colors.white, fontWeight: '600' },
  rankInfo: { flex: 1 },
  rankName: { fontSize: 13, color: colors.textPrimary, fontWeight: '600' },
  rankGenre: { fontSize: 11, color: colors.textFaint, marginTop: 1 },
  dragHandle: { fontSize: 18, color: colors.border },
  addBtn: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.border, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 6 },
  addBtnText: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
})