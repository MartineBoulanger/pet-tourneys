'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import {
  LeaguePetStat,
  BattleLogsStats,
  ChartData,
} from '@/types/supabase.types';
import { abilitiesCategoryNames } from '@/lib/logs-data/abilitiesCategoryNames';
import { transformPetSwapData } from '@/utils/supabase/transformPetSwapData';
import { capitalizeWord } from '@/utils/capitalizeWord';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  rowHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#f3f4f6',
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: '#374151',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 10,
    color: '#111827',
  },
  paragraph: {
    fontSize: 10,
    marginBottom: 20,
    color: '#303030',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 6,
    marginTop: 4,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  col1: { width: '35%', fontSize: 9 },
  col2: { width: '15%', fontSize: 9, textAlign: 'center' },
  col3: { width: '15%', fontSize: 9, textAlign: 'center' },
  col4: { width: '15%', fontSize: 9, textAlign: 'center' },
  col5: { width: '20%', fontSize: 9, textAlign: 'center' },
  colHeader: { fontWeight: 'bold' },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  statBox: {
    width: '30%',
    backgroundColor: '#f9fafb',
    padding: 8,
    borderRadius: 4,
  },
  statBoxLabel: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 2,
  },
  statBoxValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  coverPage: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  coverTitle: {
    fontSize: 32,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 18,
    color: '#374151',
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  coverImage: {
    width: 250,
    height: 250,
    marginBottom: 40,
  },
  coverMeta: {
    fontSize: 12,
    color: '#666666',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

type Props = {
  leagueName: string;
  petStats: LeaguePetStat[];
  battleStats: BattleLogsStats;
  chartData: ChartData;
  isMatchView?: boolean;
};

export function StatisticsPDF({
  leagueName,
  petStats,
  battleStats,
  chartData,
  isMatchView = false,
}: Props) {
  const general = battleStats.generalStats;
  const bStats = battleStats.battleStats;
  const abilityStats = battleStats.abilityStats;

  // Safe default values for all stats
  const safeStats = {
    // league stats
    totalMatches: general.totalMatches || 0,
    totalBattles: general.totalBattles || 0,
    averageDuration: general.averageDuration || '',
    battleResults: general.battleResults || {},
    matchResults: general.matchResults || {},
    matchesByRegion: general.matchesByRegion || {},
    // pets stats
    totalPetSwaps: bStats.totalPetSwaps || {},
    petSwapDetails: bStats.petSwapDetails || {},
    weatherChanges: bStats.weatherChanges || {},
    totalWeatherChanges: bStats.totalWeatherChanges || 0,
    totalDeaths: bStats.totalDeaths || 0,
    totalKills: bStats.totalKills || 0,
    petPerformance: bStats.petPerformance || {},
    petBreedData: chartData.petBreedData || [],
    petTypeData: chartData.petTypeData || [],
    // abilities stats
    abilityStats: abilityStats || {},
    totalAbilitiesUsed: abilityStats.totalUniqueAbilitiesUsed || 0,
  };

  const swaps = transformPetSwapData(safeStats.totalPetSwaps) || [];

  const totalSwaps =
    swaps.length > 0
      ? swaps.map((t) => t?.value || 0).reduce((a, b) => a + b, 0)
      : 0;

  const petSwaps = Object.entries(safeStats.petSwapDetails)
    .map(([name, value]) => ({
      name,
      value: typeof value === 'number' ? value : 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
    .filter((pet) => pet.value > 0);

  const pets = Object.entries(safeStats.petPerformance)
    .map(([petName, stats]) => ({
      name: petName,
      value1: stats.kills,
      value2: stats.deaths,
    }))
    .sort((a, b) => b.value1 - a.value1)
    .slice(0, 10);

  const weathers = Object.entries(safeStats.weatherChanges.byType)
    .map(([type, count]) => ({
      name: type,
      value: count,
    }))
    .sort((a, b) => b.value - a.value);

  const sortedTypes = safeStats.petTypeData.sort((a, b) => b.value - a.value);
  const sortedBreeds = safeStats.petBreedData.sort((a, b) => b.value - a.value);

  return (
    <Document>
      {/* Cover page */}
      <Page size='A4' style={styles.coverPage}>
        <Image src={'~/PML_Logo.jpg'} style={styles.coverImage} />
        <Text style={styles.coverTitle}>{'Statistics Report'}</Text>
        <Text style={styles.coverSubtitle}>{leagueName}</Text>
        <Text style={styles.coverMeta}>
          {'Generated on '}
          {new Date().toLocaleDateString()}
        </Text>
      </Page>

      {/* Page 1 - General Stats */}
      <Page size='A4' style={styles.page}>
        <Text style={styles.title}>
          {isMatchView ? 'Match Statistics' : 'League Statistics'}
        </Text>
        <Text style={styles.subtitle}>{leagueName}</Text>

        {/* General Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'General Statistics'}</Text>
          <View style={styles.statGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>{'Total Matches'}</Text>
              <Text style={styles.statBoxValue}>{safeStats.totalMatches}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>{'Total Battles'}</Text>
              <Text style={styles.statBoxValue}>{safeStats.totalBattles}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>{'Avg Battle Duration'}</Text>
              <Text style={styles.statBoxValue}>
                {safeStats.averageDuration}
              </Text>
            </View>
          </View>
        </View>

        {/* Battle Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'Battle Results'}</Text>
          {safeStats.battleResults.map((r) => (
            <View style={styles.row} key={r.name}>
              <Text style={styles.label}>{capitalizeWord(r.name)}</Text>
              <Text style={styles.value}>{r.value}</Text>
            </View>
          ))}
        </View>

        {/* Match Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'Match Scores Distribution'}</Text>
          {safeStats.matchResults.map((r) => (
            <View style={styles.row} key={r.name}>
              <Text style={styles.label}>{r.name}</Text>
              <Text style={styles.value}>{r.value}</Text>
            </View>
          ))}
        </View>

        {/* Matches by Region */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'Matches by Region'}</Text>
          {safeStats.matchesByRegion
            .filter((r) => r.value > 0)
            .map((r) => (
              <View key={r.name} style={styles.row}>
                <Text style={styles.label}>{r.name}</Text>
                <Text style={styles.value}>{r.value}</Text>
              </View>
            ))}
        </View>

        {/*  */}
      </Page>

      {/* Page 2 - Pet Stats */}
      <Page size='A4' style={styles.page}>
        <Text style={styles.title}>{'Pet Statistics'}</Text>
        <Text style={styles.subtitle}>{leagueName}</Text>

        {/* Pet Types Used */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'Pet Types'}</Text>
          {sortedTypes.map((type, index) => (
            <View style={styles.row} key={`${type.name}-${index}`}>
              <Text style={styles.label}>{type.name}</Text>
              <Text style={styles.value}>{type.value}</Text>
            </View>
          ))}
        </View>

        {/* Breeds Used */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'Pet Breeds'}</Text>
          {sortedBreeds.map((breed, index) => (
            <View style={styles.row} key={`${breed.name}-${index}`}>
              <Text style={styles.label}>{breed.name}</Text>
              <Text style={styles.value}>{breed.value}</Text>
            </View>
          ))}
        </View>

        {/* Weather conditions */}
        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >{`Weather Conditions Applied - ${safeStats.totalWeatherChanges} total`}</Text>
          {weathers.map((w, index) => (
            <View style={styles.row} key={`${w.name}-${index}`}>
              <Text style={styles.label}>{w.name}</Text>
              <Text style={styles.value}>{w.value}</Text>
            </View>
          ))}
        </View>

        {/* Pet swap list */}
        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >{`Pet Swaps - ${totalSwaps} total -- Top 10 shown down here`}</Text>
          {petSwaps.map((pet, index) => (
            <View style={styles.row} key={`${pet.name}-${index}`}>
              <Text style={styles.label}>{pet.name}</Text>
              <Text style={styles.value}>{pet.value}</Text>
            </View>
          ))}
        </View>

        {/* Overall pet performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'Pet Assassination'}</Text>
          <View style={styles.statGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>{'Total Kills'}</Text>
              <Text style={styles.statBoxValue}>{safeStats.totalKills}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>{'Total Deaths'}</Text>
              <Text style={styles.statBoxValue}>{safeStats.totalDeaths}</Text>
            </View>
          </View>
        </View>

        {/* Pet assassins list */}
        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >{`Pet Assassins -- Top 10 shown down here`}</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.col1, styles.colHeader]}>{'Pet'}</Text>
            <Text style={[styles.col2, styles.colHeader]}></Text>
            <Text style={[styles.col3, styles.colHeader]}></Text>
            <Text style={[styles.col4, styles.colHeader]}>{'Kills'}</Text>
            <Text style={[styles.col5, styles.colHeader]}>{'Deaths'}</Text>
          </View>
          {pets.map((pet, index) => (
            <View style={styles.tableRow} key={`${pet.name}-${index}`}>
              <Text style={styles.col1}>{pet.name}</Text>
              <Text style={styles.col2}></Text>
              <Text style={styles.col2}></Text>
              <Text style={styles.col4}>{pet.value1}</Text>
              <Text style={styles.col5}>{pet.value2}</Text>
            </View>
          ))}
        </View>
      </Page>

      {/* Page 3 -- all used pets */}
      <Page size='A4' style={styles.page}>
        {/* Pet list */}
        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >{`Used Pets - ${petStats.length} total`}</Text>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.col1, styles.colHeader]}>{'Pet'}</Text>
            <Text style={[styles.col2, styles.colHeader]}>{'Type'}</Text>
            <Text style={[styles.col3, styles.colHeader]}>{'Played'}</Text>
            <Text style={[styles.col4, styles.colHeader]}>{'Wins/Losses'}</Text>
            <Text style={[styles.col5, styles.colHeader]}>{'Win Rate'}</Text>
          </View>
          {petStats.map((pet) => (
            <View style={styles.tableRow} key={pet.pet_data.name}>
              <Text style={styles.col1}>{pet.pet_data.name}</Text>
              <Text style={styles.col2}>{pet.pet_data.type}</Text>
              <Text style={styles.col3}>{pet.total_played}</Text>
              <Text style={styles.col4}>{pet.w_l}</Text>
              <Text style={styles.col5}>{`${pet.win_rate}%`}</Text>
            </View>
          ))}
        </View>
      </Page>

      {/* Page 4 - Pet Abilities Stats */}
      <Page size='A4' style={styles.page}>
        <Text style={styles.title}>{'Pet Abilities Statistics'}</Text>
        <Text style={styles.subtitle}>{leagueName}</Text>
        <Text style={styles.paragraph}>
          {
            'Down here you will see each category where a pet ability can belong to, together with the number of abilities used from the category. The total of abilities used is the number of unique abilities used, because an ability can belong to multiple categories.'
          }
        </Text>

        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >{`Used Abilities - ${safeStats.totalAbilitiesUsed} total`}</Text>
          {Object.entries(safeStats.abilityStats)
            .filter(
              ([key]) =>
                key !== 'categorizationLog' &&
                key !== 'totalUniqueAbilitiesUsed',
            )
            .filter(([_, abilities]) => {
              return Array.isArray(abilities) && abilities.length > 0;
            })
            .map(([category, abilities], index) => {
              if (Array.isArray(abilities) && abilities.length > 0) {
                const categoryLabel =
                  abilitiesCategoryNames[
                    category as keyof typeof abilitiesCategoryNames
                  ] || category;
                return (
                  <View style={styles.row} key={`${category}-${index}`}>
                    <Text style={styles.label}>{categoryLabel}</Text>
                    <Text style={styles.value}>{abilities.length}</Text>
                  </View>
                );
              }
              return null;
            })}
        </View>
      </Page>
    </Document>
  );
}
