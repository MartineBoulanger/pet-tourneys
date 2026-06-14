'use client';

import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { DownloadPDFProps } from '@/types/analyze-tool.types';
import { AbilityCategories } from '@/types/supabase.types';
import { calculateAverageDuration } from '@/utils/supabase/calculateAverageDuration';
import { getMostUsedPets } from '@/utils/supabase/getMostUsedPets';
import { analyzeUsedAbilities } from '@/utils/supabase/analyzeUsedAbilities';
import { parseBattleStatistics } from '@/utils/supabase/parseBattleStats';
import { abilitiesCategoryNames } from '@/lib/logs-data/abilitiesCategoryNames';
import { styles } from '@/styles/PDFStyleSheet';

export function GeneratePDF({
  parsedBattleLogs,
  parsedPetUsage,
  playerName,
}: DownloadPDFProps) {
  const totalBattles = parsedBattleLogs.length;
  const wins = parsedBattleLogs.filter((b) => b.result === 'WIN').length;
  const losses = parsedBattleLogs.filter((b) => b.result === 'LOSS').length;
  const draws = parsedBattleLogs.filter((b) => b.result === 'DRAW').length;
  const mostUsedPets = getMostUsedPets(parsedBattleLogs);
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
    totalKills: battleStats.totalKills || 0,
    petPerformance: battleStats.petPerformance || {},
  };

  // Totals per type
  const typeStats = parsedPetUsage.reduce<Record<string, number>>(
    (acc, pet) => {
      const type = pet.pet_data.type;
      acc[type] = (acc[type] || 0) + pet.total_played;
      return acc;
    },
    {},
  );

  const sortedTypes = Object.entries(typeStats).sort((a, b) => b[1] - a[1]);

  // Totals per breed — each pet has parallel arrays of breeds + times_played
  const breedStats = parsedPetUsage.reduce<Record<string, number>>(
    (acc, pet) => {
      pet.pet_data.breeds.forEach((breed: string, i: number) => {
        const count = pet.pet_data.times_played[i] || 0;
        acc[breed] = (acc[breed] || 0) + count;
      });
      return acc;
    },
    {},
  );

  const sortedBreeds = Object.entries(breedStats).sort((a, b) => b[1] - a[1]);

  return (
    <Document>
      {/* ========== COVER PAGE ========== */}
      <Page size='A4' style={[styles.coverPage, styles.bgColor]}>
        <Image
          src={'/PMLFinalBlack.jpg'}
          style={[styles.coverImage, styles.bottomXL]}
        />
        <Text style={[styles.coverTitle, styles.fontBold, styles.bottomBase]}>
          {'Statistics Report'}
        </Text>
        <Text style={[styles.coverSubtitle, styles.fontBold, styles.bottomXL]}>
          {playerName || 'Anonymous Battler'}
        </Text>
        <Text
          style={[styles.textSize10, styles.textColorGrey, styles.coverFooter]}
        >
          {'Generated on '}
          {new Date().toLocaleDateString()}
        </Text>
      </Page>

      {/* ========== OVERALL MATCH STATISTICS PAGE ========== */}
      <Page size='A4' style={[styles.page, styles.bgColor]}>
        {/* Title */}
        <Text style={[styles.pageTitle, styles.fontBold, styles.bottomXS]}>
          {'Match Statistics'}
        </Text>
        <Text
          style={[styles.textColorGrey, styles.textSize10, styles.bottomBase]}
        >
          {playerName || 'Anonymous Battler'}
        </Text>

        <View style={styles.bottomBase}>
          <Text
            style={[
              styles.sectionTitle,
              styles.fontBold,
              styles.bottomSM,
              styles.bottomBorder,
            ]}
          >
            {'General Statistics'}
          </Text>

          <View style={[styles.flexRow, styles.blockGrid]}>
            <View style={styles.viewBlock}>
              <Text
                style={[
                  styles.viewBlockLabel,
                  styles.textSize10,
                  styles.bottomXS,
                ]}
              >
                {'Total Battles'}
              </Text>
              <Text style={[styles.viewBlockValue, styles.fontBold]}>
                {totalBattles}
              </Text>
            </View>
            <View style={styles.viewBlock}>
              <Text
                style={[
                  styles.viewBlockLabel,
                  styles.textSize10,
                  styles.bottomXS,
                ]}
              >
                {'Avg Battle Duration'}
              </Text>
              <Text style={[styles.viewBlockValue, styles.fontBold]}>
                {calculateAverageDuration(parsedBattleLogs)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomBase}>
          <Text
            style={[
              styles.sectionTitle,
              styles.fontBold,
              styles.bottomSM,
              styles.bottomBorder,
            ]}
          >
            {'Battle Results'}
          </Text>

          <View style={[styles.flexRow, styles.row, styles.bottomBorder]}>
            <Text style={[styles.textSize11, styles.label, styles.fontBold]}>
              {'Wins'}
            </Text>
            <Text style={[styles.textSize10, styles.value]}>{wins}</Text>
          </View>
          <View style={[styles.flexRow, styles.row, styles.bottomBorder]}>
            <Text style={[styles.textSize11, styles.label, styles.fontBold]}>
              {'Losses'}
            </Text>
            <Text style={[styles.textSize10, styles.value]}>{losses}</Text>
          </View>
          <View style={[styles.flexRow, styles.row, styles.bottomBorder]}>
            <Text style={[styles.textSize11, styles.label, styles.fontBold]}>
              {'Draws'}
            </Text>
            <Text style={[styles.textSize10, styles.value]}>{draws}</Text>
          </View>
        </View>
      </Page>

      {/* ========== BATTLE LOGS OVERVIEW PAGE ========== */}
      <Page size='A4' style={[styles.page, styles.bgColor]}>
        <Text style={[styles.pageTitle, styles.fontBold, styles.bottomXS]}>
          {'Battle Statistics'}
        </Text>
        <Text
          style={[styles.textColorGrey, styles.textSize10, styles.bottomBase]}
        >
          {playerName || 'Anonymous Battler'}
        </Text>

        {parsedBattleLogs.map((battle, index) => (
          <View key={index} style={[styles.bottomBase, styles.bottomBorder]}>
            <View style={[styles.flexRow, styles.row]}>
              <Text
                style={[styles.battleHeader, styles.bottomSM, styles.fontBold]}
              >
                {'Battle '}
                {index + 1}
                {' • '}
                {new Date(battle.timestamp).toLocaleString()}
              </Text>
              <Text
                style={
                  battle.result === 'WIN'
                    ? [styles.resultText, styles.paddingSM, styles.winText]
                    : battle.result === 'LOSS'
                      ? [styles.resultText, styles.paddingSM, styles.lossText]
                      : [styles.resultText, styles.paddingSM, styles.drawText]
                }
              >
                {battle.result}
              </Text>
            </View>

            <View style={[styles.flexRow, styles.paddingSM, styles.players]}>
              <View style={styles.teamList}>
                <Text
                  style={[
                    styles.teamHeader,
                    styles.bottomSM,
                    styles.fontBold,
                    styles.playerTeamHeader,
                  ]}
                >
                  {'Your Team'}
                </Text>
                <View style={styles.teamList}>
                  {battle.player_team?.map((pet: string, i: number) => (
                    <Text
                      key={`player-${i}`}
                      style={[styles.teamListItem, styles.bottomXS]}
                    >
                      {'• '}
                      {pet}
                    </Text>
                  ))}
                </View>
              </View>
              <View style={styles.teamList}>
                <Text
                  style={[
                    styles.teamHeader,
                    styles.bottomSM,
                    styles.fontBold,
                    styles.opponentTeamHeader,
                  ]}
                >
                  {'Opponent Team'}
                </Text>
                <View style={styles.teamList}>
                  {battle.opponent_team?.map((pet: string, i: number) => (
                    <Text
                      key={`opponent-${i}`}
                      style={[styles.teamListItem, styles.bottomXS]}
                    >
                      {'• '}
                      {pet}
                    </Text>
                  ))}
                </View>
              </View>
            </View>

            <Text
              style={[
                styles.battleInfo,
                styles.textSize10,
                styles.paddingSM,
                styles.bottomSM,
              ]}
            >
              {'Duration: '}
              {battle.duration}
              {' • Rounds: '}
              {battle.rounds}
            </Text>
          </View>
        ))}
      </Page>

      {/* ========== OVERALL PET USAGE STATISTICS PAGE ========== */}
      <Page size='A4' style={[styles.page, styles.bgColor]}>
        <Text style={[styles.pageTitle, styles.fontBold, styles.bottomXS]}>
          {'Pet Statistics'}
        </Text>
        <Text
          style={[styles.textColorGrey, styles.textSize10, styles.bottomBase]}
        >
          {playerName || 'Anonymous Battler'}
        </Text>

        <View style={styles.bottomBase}>
          <Text
            style={[
              styles.sectionTitle,
              styles.fontBold,
              styles.bottomSM,
              styles.bottomBorder,
            ]}
          >
            {'Pet Types'}
          </Text>
          {sortedTypes.map(([type, count], index) => (
            <View
              style={[styles.flexRow, styles.row, styles.bottomBorder]}
              key={`${type}-${index}`}
            >
              <Text style={[styles.textSize11, styles.label, styles.fontBold]}>
                {type}
              </Text>
              <Text style={[styles.textSize10, styles.value]}>{count}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bottomBase}>
          <Text
            style={[
              styles.sectionTitle,
              styles.fontBold,
              styles.bottomSM,
              styles.bottomBorder,
            ]}
          >
            {'Pet Breeds'}
          </Text>
          {sortedBreeds.map(([breed, count], index) => (
            <View
              style={[styles.flexRow, styles.row, styles.bottomBorder]}
              key={`${breed}-${index}`}
            >
              <Text style={[styles.textSize11, styles.label, styles.fontBold]}>
                {breed}
              </Text>
              <Text style={[styles.textSize10, styles.value]}>{count}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bottomBase}>
          <Text
            style={[
              styles.sectionTitle,
              styles.fontBold,
              styles.bottomSM,
              styles.bottomBorder,
            ]}
          >{`Weather Conditions Applied - ${safeStats.totalWeatherChanges} total`}</Text>
          {Object.entries(safeStats.weatherChanges.byType)
            .sort((a, b) => b[1] - a[1])
            .map(([weather, count]) => (
              <View
                style={[styles.flexRow, styles.row, styles.bottomBorder]}
                key={weather}
              >
                <Text
                  style={[styles.textSize11, styles.label, styles.fontBold]}
                >
                  {weather}
                </Text>
                <Text style={[styles.textSize10, styles.value]}>{count}</Text>
              </View>
            ))}
        </View>

        <View style={styles.bottomBase}>
          <Text
            style={[
              styles.sectionTitle,
              styles.fontBold,
              styles.bottomSM,
              styles.bottomBorder,
            ]}
          >{`Pet Swaps -- Top 10 shown down here`}</Text>
          <View style={styles.bottomBase}>
            <View style={[styles.flexRow, styles.blockGrid]}>
              <View style={styles.viewBlock}>
                <Text
                  style={[
                    styles.viewBlockLabel,
                    styles.textSize10,
                    styles.bottomXS,
                  ]}
                >{`Player Total`}</Text>
                <Text style={[styles.viewBlockValue, styles.fontBold]}>
                  {safeStats.totalPetSwaps.player}
                </Text>
              </View>
              <View style={styles.viewBlock}>
                <Text
                  style={[
                    styles.viewBlockLabel,
                    styles.textSize10,
                    styles.bottomXS,
                  ]}
                >{`Opponent Total`}</Text>
                <Text style={[styles.viewBlockValue, styles.fontBold]}>
                  {safeStats.totalPetSwaps.opponent}
                </Text>
              </View>
            </View>
          </View>

          {Object.entries(safeStats.petSwapDetails)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([pet, totalSwaps], index) => (
              <View
                style={[styles.flexRow, styles.row, styles.bottomBorder]}
                key={`${pet}-${index}`}
              >
                <Text
                  style={[styles.textSize11, styles.label, styles.fontBold]}
                >
                  {pet}
                </Text>
                <Text style={[styles.textSize10, styles.value]}>
                  {totalSwaps}
                </Text>
              </View>
            ))}
        </View>

        <View style={styles.bottomBase}>
          <Text
            style={[
              styles.sectionTitle,
              styles.fontBold,
              styles.bottomSM,
              styles.bottomBorder,
            ]}
          >
            {'Pet Assassination'}
          </Text>
          <View style={[styles.flexRow, styles.blockGrid]}>
            <View style={styles.viewBlock}>
              <Text
                style={[
                  styles.viewBlockLabel,
                  styles.textSize10,
                  styles.bottomXS,
                ]}
              >
                {'Total Kills'}
              </Text>
              <Text style={[styles.viewBlockValue, styles.fontBold]}>
                {safeStats.totalKills}
              </Text>
            </View>
            <View style={styles.viewBlock}>
              <Text
                style={[
                  styles.viewBlockLabel,
                  styles.textSize10,
                  styles.bottomXS,
                ]}
              >
                {'Total Deaths'}
              </Text>
              <Text style={[styles.viewBlockValue, styles.fontBold]}>
                {safeStats.totalDeaths}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomBase}>
          <Text
            style={[
              styles.sectionTitle,
              styles.fontBold,
              styles.bottomSM,
              styles.bottomBorder,
            ]}
          >{`Pet Assassins -- Top 10 shown down here`}</Text>
          <View style={[styles.flexRow, styles.tableHeader, styles.paddingSM]}>
            <Text style={[styles.col1, styles.fontBold, styles.textSize10]}>
              {'Pet'}
            </Text>
            <Text
              style={[styles.col2, styles.fontBold, styles.textSize10]}
            ></Text>
            <Text
              style={[styles.col3, styles.fontBold, styles.textSize10]}
            ></Text>
            <Text style={[styles.col4, styles.fontBold, styles.textSize10]}>
              {'Kills'}
            </Text>
            <Text style={[styles.col5, styles.fontBold, styles.textSize10]}>
              {'Deaths'}
            </Text>
          </View>
          {Object.entries(safeStats.petPerformance)
            .filter(([pet]) => pet)
            .sort((a, b) => (b[1]?.kills || 0) - (a[1]?.kills || 0))
            .slice(0, 10)
            .map(([pet, performance], index) => (
              <View
                style={[styles.flexRow, styles.paddingSM, styles.bottomBorder]}
                key={`${pet}-${index}`}
              >
                <Text style={styles.col1}>{pet}</Text>
                <Text style={styles.col2}></Text>
                <Text style={styles.col2}></Text>
                <Text style={styles.col4}>{performance?.kills || 0}</Text>
                <Text style={styles.col5}>{performance?.deaths || 0}</Text>
              </View>
            ))}
        </View>
      </Page>

      {/* ========== OVERALL PET PERFORMANCE STATISTICS PAGE ========== */}
      <Page size='A4' style={[styles.page, styles.bgColor]}>
        <Text style={[styles.pageTitle, styles.fontBold, styles.bottomXS]}>
          {'Pet Usage Statistics'}
        </Text>
        <Text
          style={[styles.textColorGrey, styles.textSize10, styles.bottomBase]}
        >
          {playerName || 'Anonymous Battler'}
        </Text>

        {mostUsedPets.length > 0 && (
          <View style={styles.bottomBase}>
            <Text
              style={[
                styles.sectionTitle,
                styles.fontBold,
                styles.bottomSM,
                styles.bottomBorder,
              ]}
            >
              {'Used By Overview'}
            </Text>
            <View
              style={[styles.flexRow, styles.tableHeader, styles.paddingSM]}
            >
              <Text style={[styles.col1, styles.fontBold, styles.textSize10]}>
                {'Pet'}
              </Text>
              <Text
                style={[styles.col2, styles.fontBold, styles.textSize10]}
              ></Text>
              <Text
                style={[styles.col3, styles.fontBold, styles.textSize10]}
              ></Text>
              <Text style={[styles.col4, styles.fontBold, styles.textSize10]}>
                {'Total Uses'}
              </Text>
              <Text style={[styles.col5, styles.fontBold, styles.textSize10]}>
                {'Used By'}
              </Text>
            </View>
            {mostUsedPets.map((pet, index) => (
              <View
                key={index}
                style={[styles.flexRow, styles.paddingSM, styles.bottomBorder]}
              >
                <Text style={styles.col1}>{pet.name}</Text>
                <Text style={styles.col2}></Text>
                <Text style={styles.col3}></Text>
                <Text style={styles.col4}>{pet.count}</Text>
                <Text style={styles.col5}>
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
        {parsedPetUsage.length > 0 && (
          <View style={styles.bottomBase}>
            <Text
              style={[
                styles.sectionTitle,
                styles.fontBold,
                styles.bottomSM,
                styles.bottomBorder,
              ]}
            >
              {'Used Pets Overview'}
            </Text>
            <View
              style={[styles.flexRow, styles.tableHeader, styles.paddingSM]}
            >
              <Text style={[styles.col1, styles.fontBold, styles.textSize10]}>
                {'Pet'}
              </Text>
              <Text style={[styles.col2, styles.fontBold, styles.textSize10]}>
                {'Type'}
              </Text>
              <Text style={[styles.col3, styles.fontBold, styles.textSize10]}>
                {'Breeds'}
              </Text>
              <Text style={[styles.col4, styles.fontBold, styles.textSize10]}>
                {'Played/Breed'}
              </Text>
              <Text style={[styles.col5, styles.fontBold, styles.textSize10]}>
                {'Total Played'}
              </Text>
            </View>
            {parsedPetUsage.map((pet, index) => (
              <View
                key={index}
                style={[styles.flexRow, styles.paddingSM, styles.bottomBorder]}
              >
                <Text style={styles.col1}>{pet.pet_data.name}</Text>
                <Text style={styles.col2}>{pet.pet_data.type}</Text>
                <Text style={styles.col3}>
                  {pet.pet_data.breeds.join(', ')}
                </Text>
                <Text style={styles.col4}>
                  {pet.pet_data.times_played.join(', ')}
                </Text>
                <Text style={styles.col5}>{pet.total_played}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>

      {/* ========== OVERALL PET ABILITIES STATISTICS PAGE ========== */}
      <Page size='A4' style={[styles.page, styles.bgColor]}>
        <Text style={[styles.pageTitle, styles.fontBold, styles.bottomXS]}>
          {'Pet Abilities Statistics'}
        </Text>
        <Text
          style={[styles.textColorGrey, styles.textSize10, styles.bottomBase]}
        >
          {playerName || 'Anonymous Battler'}
        </Text>

        <Text
          style={[
            styles.paragraph,
            styles.textSize10,
            styles.bottomBase,
            styles.paddingSM,
          ]}
        >
          {
            'Down here you will see each category where a pet ability can belong to, together with the number of abilities used from the category. The total of abilities used is the number of unique abilities used, because an ability can belong to multiple categories.'
          }
        </Text>

        <View style={styles.bottomBase}>
          <Text
            style={[
              styles.sectionTitle,
              styles.fontBold,
              styles.bottomSM,
              styles.bottomBorder,
            ]}
          >{`Used Abilities - ${usedAbilities.totalUniqueAbilitiesUsed} total`}</Text>
          {(
            Object.entries(usedAbilities) as [
              keyof AbilityCategories,
              string[],
            ][]
          )
            .filter(([_, abilities]) => abilities && abilities.length > 0)
            .map(([category, abilities], index) => {
              if (Array.isArray(abilities) && abilities.length > 0) {
                const categoryLabel =
                  abilitiesCategoryNames[
                    category as keyof typeof abilitiesCategoryNames
                  ] || category;
                return (
                  <View
                    style={[styles.flexRow, styles.row, styles.bottomBorder]}
                    key={`${category}-${index}`}
                  >
                    <Text
                      style={[styles.textSize11, styles.label, styles.fontBold]}
                    >
                      {categoryLabel}
                    </Text>
                    <Text style={[styles.textSize10, styles.value]}>
                      {abilities.length}
                    </Text>
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
