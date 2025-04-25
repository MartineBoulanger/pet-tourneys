'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { DownloadPDFProps } from '@/types';
import {
  calculateAverageDuration,
  getMostUsedPets,
} from '@/utils/analyzeToolHelpers';

// Register fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helvetica/v15/Helvetica.ttf' },
    {
      src: 'https://fonts.gstatic.com/s/helvetica/v15/Helvetica-Bold.ttf',
      fontWeight: 'bold',
    },
    {
      src: 'https://fonts.gstatic.com/s/helvetica/v15/Helvetica-Oblique.ttf',
      fontStyle: 'italic',
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#101010',
  },
  subHeader: {
    fontSize: 10,
    marginBottom: 20,
    textAlign: 'center',
    color: '#a9a9a9',
    fontStyle: 'italic',
  },
  playerInfo: {
    fontSize: 12,
    color: '#2f3648',
  },
  sectionHeader: {
    fontSize: 16,
    marginTop: 30,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#101010',
  },
  subsectionHeader: {
    fontSize: 14,
    marginTop: 15,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#303030',
  },
  playerTeamHeader: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#00d3f2',
  },
  opponentTeamHeader: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#c27aff',
  },
  battleHeader: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#2f3648',
  },
  petItem: {
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 4,
  },
  petList: {
    flexDirection: 'column',
  },
  battleInfo: {
    fontSize: 10,
    marginTop: 5,
    marginBottom: 10,
    fontStyle: 'italic',
    color: '#a9a9a9',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginVertical: 10,
  },
  tableHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f1f1f1',
    backgroundColor: '#2f3648',
    padding: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    alignItems: 'center',
    paddingVertical: 5,
  },
  players: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 5,
  },
  tableCell: {
    fontSize: 11,
    padding: 5,
    flex: 1,
  },
  winText: {
    color: '#016630',
    fontWeight: 'bold',
  },
  lossText: {
    color: '#9f0712',
    fontWeight: 'bold',
  },
  drawText: {
    color: '#894b00',
    fontWeight: 'bold',
  },
});

export function GeneratePDF({
  parsedBattleLogs,
  parsedPetUsage,
  playerName,
}: DownloadPDFProps) {
  // Calculate statistics
  const totalBattles = parsedBattleLogs.length;
  const wins = parsedBattleLogs.filter((b) => b.result === 'WIN').length;
  const losses = parsedBattleLogs.filter((b) => b.result === 'LOSS').length;
  const draws = parsedBattleLogs.filter((b) => b.result === 'DRAW').length;
  const mostUsedPets = getMostUsedPets(parsedBattleLogs, 5);

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* Header Section */}
        <Text style={styles.header}>{'Battle Logs Analysis'}</Text>
        {/* Sub Header */}
        <Text style={styles.subHeader}>
          {'Generated on '}
          {new Date().toLocaleDateString()}
        </Text>
        {/* Player Info */}
        <Text style={styles.playerInfo}>
          {'Character name: '}
          {playerName || 'Unknown'}
        </Text>
        {/* Battle Statistics */}
        <Text style={styles.sectionHeader}>
          {'Battles Overview Statistics'}
        </Text>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text>{'Total Battles'}</Text>
          </View>
          <View style={styles.tableCell}>
            <Text>{totalBattles}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text>{'Wins'}</Text>
          </View>
          <View style={styles.tableCell}>
            <Text>{wins}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text>{'Losses'}</Text>
          </View>
          <View style={styles.tableCell}>
            <Text>{losses}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text>{'Draws'}</Text>
          </View>
          <View style={styles.tableCell}>
            <Text>{draws}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text>{'Avg Duration'}</Text>
          </View>
          <View style={styles.tableCell}>
            <Text>{calculateAverageDuration(parsedBattleLogs)}</Text>
          </View>
        </View>
        {/* Most Used Pets */}
        {mostUsedPets.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>{'Top 5 Most Used Pets'}</Text>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                {'Pet Name'}
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                {'Times Played'}
              </Text>
            </View>
            {mostUsedPets.map((pet, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text>{pet.name}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{pet.count}</Text>
                </View>
              </View>
            ))}
          </>
        )}
        {/* Pet Usage Details */}
        {parsedPetUsage.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>{'Pet Usage Details'}</Text>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                {'Pet'}
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                {'Type'}
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                {'Breeds'}
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                {'Played'}
              </Text>
            </View>
            {parsedPetUsage.map((pet, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  { backgroundColor: index % 2 === 0 ? '#f1f1f1' : '#ffffff' },
                ]}
              >
                <Text style={styles.tableCell}>{pet.pet_data.name}</Text>
                <Text style={styles.tableCell}>{pet.pet_data.type}</Text>
                <Text style={styles.tableCell}>
                  {pet.pet_data.breeds.join(', ')}
                </Text>
                <Text style={styles.tableCell}>{pet.total_played}</Text>
              </View>
            ))}
          </>
        )}
        {/* Individual Battles */}
        <Text style={styles.sectionHeader}>{'Battles Info Overview'}</Text>
        {parsedBattleLogs.map((battle, index) => (
          <View key={index} wrap={false}>
            <View style={styles.divider} />
            <Text style={styles.battleHeader}>
              {'Battle '}
              {index + 1}
              {' • '}
              {new Date(battle.timestamp).toLocaleString()}
              {' • '}
              <Text
                style={
                  battle.result === 'WIN'
                    ? styles.winText
                    : battle.result === 'LOSS'
                    ? styles.lossText
                    : styles.drawText
                }
              >
                {battle.result}
              </Text>
            </Text>
            <View style={styles.players}>
              <View style={styles.petList}>
                <Text style={styles.playerTeamHeader}>Your Team</Text>
                <View style={styles.petList}>
                  {battle.player_team?.map((pet, i) => (
                    <Text key={`player-${i}`} style={styles.petItem}>
                      {'• '}
                      {pet}
                    </Text>
                  ))}
                </View>
              </View>
              <View style={styles.petList}>
                <Text style={styles.opponentTeamHeader}>Opponent Team</Text>
                <View style={styles.petList}>
                  {battle.opponent_team?.map((pet, i) => (
                    <Text key={`opponent-${i}`} style={styles.petItem}>
                      {'• '}
                      {pet}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.battleInfo}>
              {'Duration: '}
              {battle.duration}
              {' • Rounds: '}
              {battle.rounds}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
