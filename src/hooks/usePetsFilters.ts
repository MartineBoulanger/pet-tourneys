'use client';

import { Pet } from '@/components/statistics/types';
import { PETS_PER_PAGE, petTypeColors } from '@/utils/constants';
import { BattleStatistics, BreedStats, TournamentPetStat } from '@/utils/types';
import { useState, useMemo } from 'react';

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
  const [expandedPets, setExpandedPets] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
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

  const petPerformance = battleStats?.petPerformance || {};
  const petSwapDetails = battleStats?.petSwapDetails || {};

  // Create a map of pet stats by name for easy lookup
  const petStatsMap = new Map<string, TournamentPetStat>();
  petStats.forEach((stat) => {
    petStatsMap.set(stat.pet_data.name, stat);
  });

  // Filter and sort pets
  const filteredPets = useMemo(() => {
    let result = petData.filter((pet) => {
      // Search term matching
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
        );

      // Filter matching
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

    // Apply sorting
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
  }, [petData, petStatsMap, searchTerm, sortOption, filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPets.length / PETS_PER_PAGE);
  const currentPetData = filteredPets.slice(
    (currentPage - 1) * PETS_PER_PAGE,
    currentPage * PETS_PER_PAGE
  );

  const togglePet = (petName: string) => {
    setExpandedPets((prev) => ({
      ...prev,
      [petName]: !prev[petName],
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSortOption('name-asc');
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

  // Get unique values for filter dropdowns
  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    petData.forEach((pet) => types.add(pet.type));
    return Array.from(types).sort();
  }, [petData]);

  const uniqueExpansions = useMemo(() => {
    const expansions = new Set<string>();
    petData.forEach((pet) => expansions.add(pet.expansion));
    return Array.from(expansions).sort();
  }, [petData]);

  const uniqueBreeds = useMemo(() => {
    const breeds = new Set<string>();
    petData.forEach((pet) => {
      if (pet.availableBreeds) {
        pet.availableBreeds.split(',').forEach((breed) => {
          breeds.add(breed.trim());
        });
      }
    });
    return Array.from(breeds).sort();
  }, [petData]);

  const uniqueSources = useMemo(() => {
    const sources = new Set<string>();
    petData.forEach((pet) => sources.add(pet.source));
    return Array.from(sources)
      .sort()
      .filter((s) => s !== '');
  }, [petData]);

  // pet detail functions that are needed in the mapping of the pets
  const getPetStats = (name: string) => {
    const stats = petStatsMap.get(name);
    const breeds = stats?.breed_stats.map((bs) => ({
      ...bs,
      normalizedBreed: bs.breed.trim(),
    }));

    let graphData = [];
    const baseGraphData = [
      {
        name: 'Total Played',
        value: stats?.total_played || 0,
      },
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
    if (isMatchView) {
      graphData = baseGraphData;
    } else {
      graphData = [
        ...baseGraphData,
        {
          name: 'Matches',
          value: stats?.match_count || 0,
        },
        {
          name: 'Wins',
          value: stats?.wins || 0,
        },
        {
          name: 'Losses',
          value: stats?.losses || 0,
        },
      ];
    }
    return {
      stats,
      breeds,
      graphData,
    };
  };

  const getTypeColor = (type: string) => {
    return petTypeColors[type as keyof typeof petTypeColors];
  };

  const setAvailableBreedToArray = (breeds: string) => {
    return breeds.split(',').map((breed) => breed.trim());
  };

  return {
    uniqueSources,
    uniqueBreeds,
    uniqueExpansions,
    uniqueTypes,
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
