'use client';

import { useState, useMemo } from 'react';
import { Pet } from '@/features/supabase/components/statistics/types';
import { PETS_PER_PAGE, petTypeColors } from '@/features/supabase/constants';
import { BattleStatistics, TournamentPetStat } from '@/features/supabase/types';

interface UsePetsFiltersProps {
  petData: Pet[];
  petStats: TournamentPetStat[];
  battleStats?: BattleStatistics;
  isMatchView?: boolean;
}

export const usePetsFilters = ({
  petData,
  petStats,
  battleStats,
  isMatchView = false,
}: UsePetsFiltersProps) => {
  // states to set and to use
  const [expandedPets, setExpandedPets] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('played-desc');
  const [filters, setFilters] = useState({
    type: '',
    expansion: '',
    breed: '',
    source: '',
    tradable: false,
    capturable: false,
    isHordeOnly: false,
    isAllianceOnly: false,
  });

  // local data to use for the pets data and the list
  const petPerformance = battleStats?.petPerformance || {};
  const petSwapDetails = battleStats?.petSwapDetails || {};
  const petStatsMap = new Map<string, TournamentPetStat>();
  petStats.forEach((stat) => {
    petStatsMap.set(stat.pet_data.name, stat);
  });

  // filtering, sorting and searching the pet data
  const filteredPets = useMemo(() => {
    const result = petData.filter((pet) => {
      const matchesSearch =
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        [
          pet.ability1,
          pet.ability2,
          pet.ability3,
          pet.ability4,
          pet.ability5,
          pet.ability6,
        ].some(
          (ability) =>
            ability && ability.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        pet.petID.includes(searchTerm);

      const matchesType = !filters.type || pet.type === filters.type;
      const matchesExpansion =
        !filters.expansion || pet.expansion === filters.expansion;
      const matchesBreed =
        !filters.breed ||
        (pet.availableBreeds &&
          pet.availableBreeds
            .split(',')
            .map((b) => b.trim())
            .includes(filters.breed));
      const matchesSource = !filters.source || pet.source === filters.source;
      const matchesTradable = !filters.tradable || pet.isTradable === 'Yes';
      const matchesCapturable =
        !filters.capturable || pet.isCapturable === 'Yes';
      const matchesAlliance =
        !filters.isAllianceOnly || pet.isAllianceOnly === 'Yes';
      const matchesHorde = !filters.isHordeOnly || pet.isHordeOnly === 'Yes';

      return (
        matchesSearch &&
        matchesType &&
        matchesExpansion &&
        matchesBreed &&
        matchesSource &&
        matchesTradable &&
        matchesCapturable &&
        matchesAlliance &&
        matchesHorde &&
        petStatsMap.has(pet.name)
      );
    });

    switch (sortOption) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'played-asc':
        result.sort((a, b) => {
          const statA = petStatsMap.get(a.name)?.total_played || 0;
          const statB = petStatsMap.get(b.name)?.total_played || 0;
          return statA - statB;
        });
        break;
      case 'played-desc':
        result.sort((a, b) => {
          const statA = petStatsMap.get(a.name)?.total_played || 0;
          const statB = petStatsMap.get(b.name)?.total_played || 0;
          return statB - statA;
        });
        break;
      case 'wins-asc':
        result.sort((a, b) => {
          const statA = petStatsMap.get(a.name)?.wins || 0;
          const statB = petStatsMap.get(b.name)?.wins || 0;
          return statA - statB;
        });
        break;
      case 'wins-desc':
        result.sort((a, b) => {
          const statA = petStatsMap.get(a.name)?.wins || 0;
          const statB = petStatsMap.get(b.name)?.wins || 0;
          return statB - statA;
        });
        break;
      case 'winrate-asc':
        result.sort((a, b) => {
          const statA = petStatsMap.get(a.name)?.win_rate || 0;
          const statB = petStatsMap.get(b.name)?.win_rate || 0;
          return statA - statB;
        });
        break;
      case 'winrate-desc':
        result.sort((a, b) => {
          const statA = petStatsMap.get(a.name)?.win_rate || 0;
          const statB = petStatsMap.get(b.name)?.win_rate || 0;
          return statB - statA;
        });
        break;
      case 'losses-asc':
        result.sort((a, b) => {
          const statA = petStatsMap.get(a.name)?.losses || 0;
          const statB = petStatsMap.get(b.name)?.losses || 0;
          return statA - statB;
        });
        break;
      case 'losses-desc':
        result.sort((a, b) => {
          const statA = petStatsMap.get(a.name)?.losses || 0;
          const statB = petStatsMap.get(b.name)?.losses || 0;
          return statB - statA;
        });
        break;
      case 'matches-asc':
        result.sort((a, b) => {
          const statA = petStatsMap.get(a.name)?.match_count || 0;
          const statB = petStatsMap.get(b.name)?.match_count || 0;
          return statA - statB;
        });
        break;
      case 'matches-desc':
        result.sort((a, b) => {
          const statA = petStatsMap.get(a.name)?.match_count || 0;
          const statB = petStatsMap.get(b.name)?.match_count || 0;
          return statB - statA;
        });
        break;
      case 'kills-asc':
        result.sort((a, b) => {
          const statA = petPerformance[a.name]?.kills || 0;
          const statB = petPerformance[b.name]?.kills || 0;
          return statA - statB;
        });
        break;
      case 'kills-desc':
        result.sort((a, b) => {
          const statA = petPerformance[a.name]?.kills || 0;
          const statB = petPerformance[b.name]?.kills || 0;
          return statB - statA;
        });
        break;
      case 'deaths-asc':
        result.sort((a, b) => {
          const statA = petPerformance[a.name]?.deaths || 0;
          const statB = petPerformance[b.name]?.deaths || 0;
          return statA - statB;
        });
        break;
      case 'deaths-desc':
        result.sort((a, b) => {
          const statA = petPerformance[a.name]?.deaths || 0;
          const statB = petPerformance[b.name]?.deaths || 0;
          return statB - statA;
        });
        break;
      case 'swaps-asc':
        result.sort((a, b) => {
          const statA = petSwapDetails[a.name] || 0;
          const statB = petSwapDetails[b.name] || 0;
          return statA - statB;
        });
        break;
      case 'swaps-desc':
        result.sort((a, b) => {
          const statA = petSwapDetails[a.name] || 0;
          const statB = petSwapDetails[b.name] || 0;
          return statB - statA;
        });
        break;
      default:
        break;
    }

    return result;
  }, [
    petData,
    petStatsMap,
    searchTerm,
    sortOption,
    filters,
    petPerformance,
    petSwapDetails,
  ]);

  // pagination
  const totalPages = Math.ceil(filteredPets.length / PETS_PER_PAGE);
  const currentPetData = filteredPets.slice(
    (currentPage - 1) * PETS_PER_PAGE,
    currentPage * PETS_PER_PAGE
  );

  // show/hide pet data in dropdown
  const togglePet = (petName: string) => {
    setExpandedPets((prev) => ({
      ...prev,
      [petName]: !prev[petName],
    }));
  };

  // pagination page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // setting the change of the filter(s)
  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // reset all filters, sorting and search
  const resetFilters = () => {
    setSearchTerm('');
    setSortOption('played-desc');
    setFilters({
      type: '',
      expansion: '',
      breed: '',
      source: '',
      tradable: false,
      capturable: false,
      isAllianceOnly: false,
      isHordeOnly: false,
    });
    setCurrentPage(1);
  };

  // get unique values for filter dropdowns
  const uniqueStats = useMemo(() => {
    const types = new Set<string>();
    const expansions = new Set<string>();
    const sources = new Set<string>();
    const breeds = new Set<string>();

    petData.forEach((pet) => {
      types.add(pet.type);
      expansions.add(pet.expansion);
      sources.add(pet.source);
      if (pet.availableBreeds) {
        pet.availableBreeds.split(',').forEach((breed) => {
          breeds.add(breed.trim());
        });
      }
    });

    return {
      types: Array.from(types).sort(),
      expansions: Array.from(expansions).sort(),
      sources: Array.from(sources)
        .sort()
        .filter((s) => s !== ''),
      breeds: Array.from(breeds).sort(),
    };
  }, [petData]);

  // function that is used inside the mapping, to get the correct battle stats data per pet
  const getPetStats = (name: string) => {
    const stats = petStatsMap.get(name);
    const breeds = stats?.breed_stats.map((bs) => ({
      ...bs,
      normalizedBreed: bs.breed.trim(),
    }));
    const winRate = stats?.win_rate || 0;
    const kills = petPerformance[name]?.kills || 0;
    const played = stats?.total_played || 1;
    const totalPlayed = stats?.total_played || 0;
    const totalMatches = stats?.match_count || 0;

    const killRatio = kills / played;
    let strength: 'strong' | 'weak' | 'average' = 'average';

    if (killRatio > 0.8) strength = 'strong';
    else if (killRatio < 0.15) strength = 'weak';

    let graphData = [];
    if (isMatchView) {
      graphData = [
        {
          name: 'Kills',
          value: petPerformance[name]?.kills || 0,
        },
        {
          name: 'Deaths',
          value: petPerformance[name]?.deaths || 0,
        },
        {
          name: 'Swaps',
          value: petSwapDetails[name] || 0,
        },
      ];
    } else {
      graphData = [
        {
          name: 'Wins',
          value: stats?.wins || 0,
        },
        {
          name: 'Kills',
          value: petPerformance[name]?.kills || 0,
        },
        {
          name: 'Losses',
          value: stats?.losses || 0,
        },
        {
          name: 'Deaths',
          value: petPerformance[name]?.deaths || 0,
        },
        {
          name: 'Swaps',
          value: petSwapDetails[name] || 0,
        },
      ];
    }
    return {
      stats,
      breeds,
      graphData,
      winRate,
      strength,
      totalMatches,
      totalPlayed,
    };
  };

  // getting the color from each pet type
  const getTypeColor = (type: string) => {
    return petTypeColors[type as keyof typeof petTypeColors];
  };

  // set all available breed per pet in an array of strings
  const setAvailableBreedToArray = (breeds: string) => {
    return breeds.split(',').map((breed) => breed.trim());
  };

  return {
    uniqueStats,
    resetFilters,
    handleFilterChange,
    handlePageChange,
    togglePet,
    totalPages,
    currentPetData,
    expandedPets,
    currentPage,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    filters,
    getPetStats,
    getTypeColor,
    setAvailableBreedToArray,
  };
};
