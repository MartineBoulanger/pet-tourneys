'use server';

import { getPlayerRecords } from '../actions/players';
import { Pet } from '../components/statistics/types';
import { EnhancedPlayerRecord } from '../actions/players';

export type PetData = Pet[];

export type PlayerRankingsData = {
  records: EnhancedPlayerRecord[];
  regions: string[];
};

export type HallOfFameData = {
  season: string;
  tournamentName: string;
  champion: {
    name: string;
    regionFlag: string;
    guild?: string;
    avatar?: string;
  };
  runnerUp: {
    name: string;
  };
  finalsLink: string;
  mostUsedPet?: {
    name?: string;
    image?: string;
  };
}[];

type JsonData = PetData | PlayerRankingsData | HallOfFameData | null;

type JsonResponse<T extends JsonData = JsonData> = {
  success: boolean;
  data: T;
  error?: string;
};

async function fetchJsonSafe<T extends JsonData>(
  url: string
): Promise<JsonResponse<T>> {
  try {
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      return {
        success: false,
        data: null as T,
        error: `HTTP ${response.status}`,
      };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return {
        success: false,
        data: null as T,
        error: 'Response is not JSON',
      };
    }

    const data: T = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      data: null as T,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Function to load the pet data JSON file
export async function loadPetsData(): Promise<PetData> {
  const jsonPath = `${process.env.BASE_URL!}/json-files/pets-data.json`;
  const result = await fetchJsonSafe<PetData>(jsonPath);

  if (!result.success) {
    console.log('No JSON pets data available, using empty data');
    return [];
  }

  return result.data || [];
}

// Function to load the player data JSON file
export async function loadPlayerData(id: string) {
  const jsonPath = `${process.env
    .BASE_URL!}/json-files/rankings-data/player-rankings-${id.slice(
    0,
    5
  )}.json`;

  const result = await fetchJsonSafe<PlayerRankingsData>(jsonPath);

  // If JSON fetch was successful and has valid structure, use it
  if (result.success && result.data?.records && result.data?.regions) {
    return result.data;
  }

  // Otherwise fall back to Supabase
  console.log('JSON unavailable, using Supabase data');

  try {
    const { records, regions } = await getPlayerRecords(id);
    return { records, regions };
  } catch (supabaseError) {
    console.error('Supabase also failed:', supabaseError);
    return { records: [], regions: [] };
  }
}

// Function to load the hall of fame data JSON file
export async function loadHallOfFameData() {
  const jsonPath = `${process.env.BASE_URL!}/json-files/hof.json`;
  const result = await fetchJsonSafe<HallOfFameData>(jsonPath);

  if (!result.success) {
    console.log('No JSON hall of fame data available, using empty data');
    return [];
  }

  return result.data || [];
}
