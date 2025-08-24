import { getPlayerRecords } from "@/supabase/actions/players";

export async function loadPetsData() {
  try {
    const jsonPath = `${process.env
      .NEXT_PUBLIC_BASE_URL!}/json-files/pets-data.json`;

    const response = await fetch(jsonPath, { cache: 'no-store' });

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON but got: ${text.substring(0, 50)}...`);
    }

    const jsonData = await response.json();

    if (!jsonData) {
      throw new Error('Invalid JSON structure - missing the pets data');
    }

    return jsonData;
  } catch (jsonError) {
    console.error('JSON load failed, no Json file found', jsonError);
  }
}

export async function loadPlayerData(id: string) {
  try {
    const jsonPath = `${process.env
      .NEXT_PUBLIC_BASE_URL!}/json-files/rankings-data/player-rankings-${id.slice(
      0,
      5
    )}.json`;

    const response = await fetch(jsonPath, { cache: 'no-store' });

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON but got: ${text.substring(0, 50)}...`);
    }

    const jsonData = await response.json();

    if (!jsonData.records || !jsonData.regions) {
      throw new Error('Invalid JSON structure - missing records or regions');
    }

    return jsonData;
  } catch (jsonError) {
    console.error('JSON load failed, falling back to Supabase', jsonError);

    try {
      const { records, regions } = await getPlayerRecords(id);
      return { records, regions };
    } catch (supabaseError) {
      console.error('Both JSON and Supabase failed:', supabaseError);
      throw new Error('Failed to load player data from any source');
    }
  }
}