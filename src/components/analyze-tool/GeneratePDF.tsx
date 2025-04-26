'use client';

import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { DownloadPDFProps } from '@/types';
import {
  calculateAverageDuration,
  getMostUsedPets,
} from '@/utils/analyzeToolHelpers';
import { styles } from './PDFStyleSheet';

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
      {/* ========== COVER PAGE ========== */}
      <Page size='A4' style={styles.coverPage}>
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL!}/images/tourney-logo.png`}
          style={styles.coverImage}
        />
        <Text style={styles.coverTitle}>{'Pet Battle Analysis Report'}</Text>
        <Text style={styles.coverSubtitle}>
          {playerName || 'Anonymous Battler'}
        </Text>
        <Text style={styles.coverMeta}>
          {'Generated on '}
          {new Date().toLocaleDateString()}
        </Text>
      </Page>

      {/* ========== MAIN CONTENT PAGE ========== */}
      <Page size='A4' style={styles.page}>
        {/* Header Section */}
        <Text style={styles.header}>{'Battle Logs Analysis'}</Text>
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
                <Text style={styles.playerTeamHeader}>{'Your Team'}</Text>
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
                <Text style={styles.opponentTeamHeader}>{'Opponent Team'}</Text>
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
