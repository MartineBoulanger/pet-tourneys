'use client';

import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { DownloadPDFProps } from '@/types';
import {
  calculateAverageDuration,
  getMostUsedPets,
} from '@/utils/analyzeToolHelpers';
import { parseBattleStatistics } from '@/utils/parsers';
import { styles } from './PDFStyleSheet';

export function GeneratePDF({
  parsedBattleLogs,
  parsedPetUsage,
  playerName,
}: DownloadPDFProps) {
  const totalBattles = parsedBattleLogs.length;
  const wins = parsedBattleLogs.filter((b) => b.result === 'WIN').length;
  const losses = parsedBattleLogs.filter((b) => b.result === 'LOSS').length;
  const draws = parsedBattleLogs.filter((b) => b.result === 'DRAW').length;
  const mostUsedPets = getMostUsedPets(parsedBattleLogs, 5);
  const battleStats = parseBattleStatistics(parsedBattleLogs);

  // Safe default values for all stats
  const safeStats = {
    ...battleStats,
    totalPetSwaps: battleStats.totalPetSwaps || { player: 0, opponent: 0 },
    petSwapDetails: battleStats.petSwapDetails || {},
    weatherChanges: battleStats.weatherChanges || { total: 0, byType: {} },
    abilityUsage: battleStats.abilityUsage || {},
    petDeaths: battleStats.petDeaths || {},
    activePetsHistory: battleStats.activePetsHistory || [],
    totalAbilityUsage: battleStats.totalAbilityUsage || 0,
    totalWeatherChanges: battleStats.totalWeatherChanges || 0,
    totalDeaths: battleStats.totalDeaths || 0,
    petPerformance: battleStats.petPerformance || {},
  };

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
          <Text style={[styles.tableCell, styles.tableHeader]}>{'Metric'}</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>{'Value'}</Text>
        </View>
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
                {'Pet'}
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                {'Total Uses'}
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                {'Player Uses'}
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                {'Opponent Uses'}
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                {'Team'}
              </Text>
            </View>
            {mostUsedPets.map((pet, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  { backgroundColor: index % 2 === 0 ? '#f1f1f1' : '#ffffff' },
                ]}
              >
                <Text style={styles.tableCell}>{pet.name}</Text>
                <Text style={styles.tableCell}>{pet.count}</Text>
                <Text style={styles.tableCell}>{pet.playerCount || '-'}</Text>
                <Text style={styles.tableCell}>{pet.opponentCount || '-'}</Text>
                <Text style={styles.tableCell}>
                  {pet.team === 'player'
                    ? 'Player'
                    : pet.team === 'opponent'
                    ? 'Opponent'
                    : 'Both'}
                </Text>
              </View>
            ))}
          </>
        )}

        {/* Pet Usage Details */}
        {parsedPetUsage.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>{'Pet Usage Statistics'}</Text>
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
                {'Times Played'}
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
                <Text style={styles.tableCell}>
                  {pet.pet_data.times_played.join(', ')}
                </Text>
                <Text style={styles.tableCell}>{pet.total_played}</Text>
              </View>
            ))}
          </>
        )}

        {/* Individual Battles */}
        <Text style={styles.sectionHeader}>
          {'Battle Logs Battles Overview'}
        </Text>
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

        {/* Pet Performance Overview */}
        <Text style={styles.sectionHeader}>{'Pets Performance Overview'}</Text>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableHeader]}>{'Metric'}</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>{'Value'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{'Total Abilities Used'}</Text>
          <Text style={styles.tableCell}>{safeStats.totalAbilityUsage}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{'Total Weather Changes'}</Text>
          <Text style={styles.tableCell}>{safeStats.totalWeatherChanges}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{'Total Pet Deaths'}</Text>
          <Text style={styles.tableCell}>{safeStats.totalDeaths}</Text>
        </View>

        {/* Pet Performance */}
        {safeStats.petPerformance &&
          Object.keys(safeStats.petPerformance).length > 0 && (
            <>
              <Text style={styles.sectionHeader}>{'Pet Performance'}</Text>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableHeader]}>
                  {'Pet'}
                </Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>
                  {'Kills'}
                </Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>
                  {'Deaths'}
                </Text>
              </View>

              {Object.entries(safeStats.petPerformance)
                .filter(([pet]) => pet)
                .sort((a, b) => (b[1]?.kills || 0) - (a[1]?.kills || 0))
                .map(([pet, performance], index) => (
                  <View
                    key={pet}
                    style={[
                      styles.tableRow,
                      {
                        backgroundColor:
                          index % 2 === 0 ? '#f1f1f1' : '#ffffff',
                      },
                    ]}
                  >
                    <Text style={styles.tableCell}>{pet}</Text>
                    <Text style={styles.tableCell}>
                      {performance?.kills || 0}
                    </Text>
                    <Text style={styles.tableCell}>
                      {performance?.deaths || 0}
                    </Text>
                  </View>
                ))}
            </>
          )}

        {/* Pet Swap Statistics */}
        <Text style={styles.sectionHeader}>{'Pet Swaps Overview'}</Text>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableHeader]}>{'Metric'}</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>{'Value'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{'Total Swaps Player'}</Text>
          <Text style={styles.tableCell}>{safeStats.totalPetSwaps.player}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{'Total Swaps Opponent'}</Text>
          <Text style={styles.tableCell}>
            {safeStats.totalPetSwaps.opponent}
          </Text>
        </View>

        {/* Most Swapped Pets */}
        <Text style={styles.sectionHeader}>{'Pet Swaps'}</Text>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableHeader]}>{'Pet'}</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>
            {'Total Swaps'}
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>
            {'Battles Appeared'}
          </Text>
        </View>

        {Object.entries(safeStats.petSwapDetails)
          .sort((a, b) => b[1].totalSwaps - a[1].totalSwaps)
          .map(([pet, data], index) => (
            <View
              key={pet}
              style={[
                styles.tableRow,
                { backgroundColor: index % 2 === 0 ? '#f1f1f1' : '#ffffff' },
              ]}
            >
              <Text style={styles.tableCell}>{pet}</Text>
              <Text style={styles.tableCell}>{data.totalSwaps}</Text>
              <Text style={styles.tableCell}>{data.battlesAppeared}</Text>
            </View>
          ))}

        {/* Weather Analysis */}
        <Text style={styles.sectionHeader}>{'Weather Usage Overview'}</Text>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableHeader]}>
            {'Weather'}
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>
            {'Times Used'}
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>
            {'Usage %'}
          </Text>
        </View>

        {Object.entries(safeStats.weatherChanges.byType)
          .sort((a, b) => b[1] - a[1])
          .map(([weather, count], index) => (
            <View
              key={weather}
              style={[
                styles.tableRow,
                { backgroundColor: index % 2 === 0 ? '#f1f1f1' : '#ffffff' },
              ]}
            >
              <Text style={styles.tableCell}>{weather}</Text>
              <Text style={styles.tableCell}>{count}</Text>
              <Text style={styles.tableCell}>
                {((count / safeStats.weatherChanges.total) * 100).toFixed(1)}
                {'%'}
              </Text>
            </View>
          ))}

        {/* Ability Analysis */}
        <Text style={styles.sectionHeader}>{'Abilities Usage Overview'}</Text>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableHeader]}>
            {'Ability'}
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>
            {'Times Used'}
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>
            {'Usage %'}
          </Text>
        </View>

        {Object.entries(safeStats.abilityUsage)
          .sort((a, b) => b[1] - a[1])
          .map(([ability, count], index) => (
            <View
              key={ability}
              style={[
                styles.tableRow,
                { backgroundColor: index % 2 === 0 ? '#f1f1f1' : '#ffffff' },
              ]}
            >
              <Text style={styles.tableCell}>{ability}</Text>
              <Text style={styles.tableCell}>{count}</Text>
              <Text style={styles.tableCell}>
                {((count / safeStats.totalAbilityUsage) * 100).toFixed(1)}
                {'%'}
              </Text>
            </View>
          ))}
      </Page>
    </Document>
  );
}
