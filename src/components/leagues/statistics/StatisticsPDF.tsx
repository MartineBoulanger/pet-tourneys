'use client';

import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { capitalizeWord } from '@/utils/capitalizeWord';
import { transformPetSwapData } from '@/utils/supabase/transformPetSwapData';
import { StatisticsPDFProps } from '@/types/supabase.types';
import { abilitiesCategoryNames } from '@/lib/logs-data/abilitiesCategoryNames';
import { styles } from '@/styles/StatisticsPDFStyles';

export function StatisticsPDF({
  leagueName,
  petStats,
  battleStats,
  chartData,
  isMatchView = false,
  matchRegion = '',
  matchOwner = '',
}: StatisticsPDFProps) {
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
        <Image src={'/PMLFinalBlack.png'} style={styles.coverImage} />
        <Text style={styles.coverTitle}>{'Statistics Report'}</Text>
        <Text
          style={
            isMatchView
              ? styles.coverSubtitle
              : [styles.coverSubtitle, styles.coverMarginBottom]
          }
        >
          {leagueName}
        </Text>
        {isMatchView ? (
          <>
            <Text
              style={styles.coverMatchOwnerTitle}
            >{`Logs From ${matchOwner}`}</Text>
            <Text
              style={[styles.coverMatchRegionTitle, styles.coverMarginBottom]}
            >
              {`Region : ${matchRegion}`}
            </Text>
          </>
        ) : null}
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
            {isMatchView ? null : (
              <View style={styles.statBox}>
                <Text style={styles.statBoxLabel}>{'Total Matches'}</Text>
                <Text style={styles.statBoxValue}>
                  {safeStats.totalMatches}
                </Text>
              </View>
            )}
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

        {isMatchView ? null : (
          <>
            {/* Match Results */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {'Match Scores Distribution'}
              </Text>
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
          </>
        )}
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
          {/* Player swaps */}
          {isMatchView ? (
            <View style={styles.section}>
              <View style={styles.statGrid}>
                {swaps.map((s, index) => (
                  <View style={styles.statBox} key={`${s.name}-${index}`}>
                    <Text
                      style={styles.statBoxLabel}
                    >{`${capitalizeWord(s.name)} Total`}</Text>
                    <Text style={styles.statBoxValue}>{s.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
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
          {isMatchView ? (
            <>
              <View style={styles.tableHeader}>
                <Text style={[styles.col1, styles.colHeader]}>{'Pet'}</Text>
                <Text style={[styles.col2, styles.colHeader]}></Text>
                <Text style={[styles.col3, styles.colHeader]}></Text>
                <Text style={[styles.col4, styles.colHeader]}>{'Type'}</Text>
                <Text style={[styles.col5, styles.colHeader]}>{'Played'}</Text>
              </View>
              {petStats.map((pet) => (
                <View style={styles.tableRow} key={pet.pet_data.name}>
                  <Text style={styles.col1}>{pet.pet_data.name}</Text>
                  <Text style={styles.col2}></Text>
                  <Text style={styles.col3}></Text>
                  <Text style={styles.col4}>{pet.pet_data.type}</Text>
                  <Text style={styles.col5}>{pet.total_played}</Text>
                </View>
              ))}
            </>
          ) : (
            <>
              <View style={styles.tableHeader}>
                <Text style={[styles.col1, styles.colHeader]}>{'Pet'}</Text>
                <Text style={[styles.col2, styles.colHeader]}>{'Type'}</Text>
                <Text style={[styles.col3, styles.colHeader]}>{'Played'}</Text>
                <Text style={[styles.col4, styles.colHeader]}>
                  {'Wins/Losses'}
                </Text>
                <Text style={[styles.col5, styles.colHeader]}>
                  {'Win Rate'}
                </Text>
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
            </>
          )}
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
