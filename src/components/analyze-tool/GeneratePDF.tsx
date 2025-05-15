'use client';

import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { DownloadPDFProps } from './types';
import { AbilityCategories } from '@/utils/types';
import {
  calculateAverageDuration,
  getMostUsedPets,
  analyzeUsedAbilities,
  abilitiesCategoryNames,
  parseBattleStatistics,
} from '@/utils/analyzeToolHelpers';
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
  const usedAbilities = analyzeUsedAbilities(parsedBattleLogs);

  // Safe default values for all stats
  const safeStats = {
    ...battleStats,
    totalPetSwaps: battleStats.totalPetSwaps || { player: 0, opponent: 0 },
    petSwapDetails: battleStats.petSwapDetails || {},
    weatherChanges: battleStats.weatherChanges || { total: 0, byType: {} },
    totalWeatherChanges: battleStats.totalWeatherChanges || 0,
    totalDeaths: battleStats.totalDeaths || 0,
    totalKills: battleStats.totalDeaths || 0,
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
        <Text style={styles.coverTitle}>{'Battle Logs Analysis Report'}</Text>
        <Text style={styles.coverSubtitle}>
          {playerName || 'Anonymous Battler'}
        </Text>
        <Text style={styles.coverMeta}>
          {'Generated on '}
          {new Date().toLocaleDateString()}
        </Text>
      </Page>

      {/* ========== TOTAL LOGS OVERVIEW PAGE ========== */}
      <Page size='A4' style={styles.page}>
        {/* Title */}
        <Text style={styles.header}>{'Battle Logs Analysis'}</Text>

        {/* Total Logs Overview */}
        <Text style={styles.sectionHeader}>{'Total Logs Overview'}</Text>
        <View style={styles.blocksGrid}>
          <View style={styles.overviewBlock}>
            <Text style={styles.overviewBlockTitle}>{'Total Battles'}</Text>
            <Text style={styles.overviewBlockValue}>{totalBattles}</Text>
          </View>
          <View style={styles.overviewBlock}>
            <Text style={styles.overviewBlockTitle}>{'Wins'}</Text>
            <Text style={styles.overviewBlockValue}>{wins}</Text>
          </View>
          <View style={styles.overviewBlock}>
            <Text style={styles.overviewBlockTitle}>{'Losses'}</Text>
            <Text style={styles.overviewBlockValue}>{losses}</Text>
          </View>
          <View style={styles.overviewBlock}>
            <Text style={styles.overviewBlockTitle}>{'Draws'}</Text>
            <Text style={styles.overviewBlockValue}>{draws}</Text>
          </View>
          <View style={styles.overviewBlock}>
            <Text style={styles.overviewBlockTitle}>{'Avg Duration'}</Text>
            <Text style={styles.overviewBlockValue}>
              {calculateAverageDuration(parsedBattleLogs)}
            </Text>
          </View>
        </View>
      </Page>

      {/* ========== BATTLE LOGS OVERVIEW PAGE ========== */}
      <Page size='A4' style={styles.page}>
        {/* Sub Title */}
        <Text style={styles.sectionHeader}>{'Battle Logs Overview'}</Text>

        {/* Battle Logs Overview */}
        {parsedBattleLogs.map((battle, index) => (
          <View
            key={index}
            style={[styles.overviewBlock, { width: '100%', marginBottom: 8 }]}
          >
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={styles.battleHeader}>
                {'Battle '}
                {index + 1}
                {' • '}
                {new Date(battle.timestamp).toLocaleString()}
              </Text>
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
            </View>
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

      {/* ========== PET USAGE OVERVIEW PAGE ========== */}
      <Page size='A4' style={styles.page}>
        {/* Title */}
        <Text style={styles.header}>{'Pet Usage Analysis'}</Text>

        {/* Most Used Pets */}
        {mostUsedPets.length > 0 && (
          <View style={{ marginBottom: 8 }}>
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
          </View>
        )}

        {/* Pet Usage List */}
        {parsedPetUsage.length > 0 && (
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.sectionHeader}>{'Pet Usage List'}</Text>

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
                {'Played Per Breed'}
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                {'Total Played'}
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
          </View>
        )}
      </Page>

      {/* ========== PET PERFORMANCES OVERVIEW PAGE ========== */}
      <Page size='A4' style={styles.page}>
        {/* Title */}
        <Text style={styles.header}>{'Pet Performance Analysis'}</Text>

        {/* Total Performance Overview */}
        <Text style={styles.sectionHeader}>{'Total Performance Overview'}</Text>
        <View style={styles.blocksGrid}>
          <View style={styles.overviewBlock}>
            <Text style={styles.overviewBlockTitle}>{'Abilities Used'}</Text>
            <Text style={styles.overviewBlockValue}>
              {usedAbilities.totalUniqueAbilitiesUsed}
            </Text>
          </View>
          <View style={styles.overviewBlock}>
            <Text style={styles.overviewBlockTitle}>{'Weather Changes'}</Text>
            <Text style={styles.overviewBlockValue}>
              {safeStats.totalWeatherChanges}
            </Text>
          </View>
          <View style={styles.overviewBlock}>
            <Text style={styles.overviewBlockTitle}>{'Pet Deaths'}</Text>
            <Text style={styles.overviewBlockValue}>
              {safeStats.totalDeaths}
            </Text>
          </View>
          <View style={styles.overviewBlock}>
            <Text style={styles.overviewBlockTitle}>{'Pet Kills'}</Text>
            <Text style={styles.overviewBlockValue}>
              {safeStats.totalKills}
            </Text>
          </View>
        </View>

        {/* Pet Performance Overview */}
        {safeStats.petPerformance &&
          Object.keys(safeStats.petPerformance).length > 0 && (
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.sectionHeader}>
                {'Pet Performance Overview'}
              </Text>
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
            </View>
          )}

        {/* Pet Swaps Overview */}
        <Text style={styles.sectionHeader}>{'Pet Swaps Overview'}</Text>
        <View style={styles.blocksGrid}>
          <View style={styles.overviewBlock}>
            <Text style={styles.overviewBlockTitle}>
              {'Total Swaps Player'}
            </Text>
            <Text style={styles.overviewBlockValue}>
              {safeStats.totalPetSwaps.player}
            </Text>
          </View>
          <View style={styles.overviewBlock}>
            <Text style={styles.overviewBlockTitle}>
              {'Total Swaps Opponent'}
            </Text>
            <Text style={styles.overviewBlockValue}>
              {safeStats.totalPetSwaps.opponent}
            </Text>
          </View>
        </View>

        {/* Pet Swaps List */}
        <Text style={styles.sectionHeader}>{'Pet Swaps List'}</Text>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableHeader]}>{'Pet'}</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>{'Swaps'}</Text>
        </View>
        {Object.entries(safeStats.petSwapDetails)
          .sort((a, b) => b[1] - a[1])
          .map(([pet, totalSwaps], index) => (
            <View
              key={pet}
              style={[
                styles.tableRow,
                { backgroundColor: index % 2 === 0 ? '#f1f1f1' : '#ffffff' },
              ]}
            >
              <Text style={styles.tableCell}>{pet}</Text>
              <Text style={styles.tableCell}>{totalSwaps}</Text>
            </View>
          ))}
      </Page>

      {/* ========== PET ABILITIES OVERVIEW PAGE ========== */}
      <Page size='A4' style={styles.page}>
        {/* Title */}
        <Text style={styles.header}>{'Pet Abilities Analysis'}</Text>

        {/* Pets abilities overview */}
        <Text style={styles.sectionHeader}>{'Total Abilities Overview'}</Text>
        <View style={styles.blocksGrid}>
          {(
            Object.entries(usedAbilities) as [
              keyof AbilityCategories,
              string[]
            ][]
          )
            .filter(([_, abilities]) => abilities && abilities.length > 0)
            .map(([category, count], index) => {
              const categoryName = abilitiesCategoryNames[category];
              return (
                <View key={index} style={styles.overviewBlock}>
                  <Text style={styles.overviewBlockTitle}>{categoryName}</Text>
                  <Text style={styles.overviewBlockValue}>{count.length}</Text>
                </View>
              );
            })}
        </View>
      </Page>
      <Page size='A4' style={styles.page}>
        {/* Weather Analysis */}
        <Text style={styles.sectionHeader}>{'Weather Changes Overview'}</Text>
        <View style={styles.blocksGrid}>
          {Object.entries(safeStats.weatherChanges.byType)
            .sort((a, b) => b[1] - a[1])
            .map(([weather, count]) => (
              <View key={weather} style={styles.overviewBlock}>
                <Text style={styles.overviewBlockTitle}>{weather}</Text>
                <Text style={styles.overviewBlockValue}>{count}</Text>
              </View>
            ))}
        </View>

        {/* Pets abilities usage lists */}
        <Text style={styles.sectionHeader}>{'Abilities Usage Lists'}</Text>
        <View style={styles.blocksGrid}>
          {(
            Object.entries(usedAbilities) as [
              keyof AbilityCategories,
              string[]
            ][]
          )
            .filter(([_, abilities]) => abilities && abilities.length > 0)
            .map(([category, abilities], index) => (
              <View key={index} style={styles.overviewBlock}>
                <Text style={styles.overviewBlockTitle}>
                  {abilitiesCategoryNames[category]}
                </Text>
                <Text style={styles.overviewBlockValueList}>
                  {abilities.map((ability, i) => (
                    <Text key={i} style={{ marginBottom: 4 }}>
                      {'• '}
                      {ability}
                      {'\n'}
                    </Text>
                  ))}
                </Text>
              </View>
            ))}
        </View>
      </Page>
    </Document>
  );
}
