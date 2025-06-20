'use server';

export const loadJsonData = async (fileName: string) => {
  try {
    const jsonPath = `${process.env
      .NEXT_PUBLIC_BASE_URL!}/json-files/${fileName}.json`;

    const response = await fetch(jsonPath, { cache: 'no-store' });

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON but got: ${text.substring(0, 50)}...`);
    }

    const jsonData = await response.json();

    if (!jsonData) {
      throw new Error('Invalid JSON structure - missing JSON data');
    }

    return jsonData;
  } catch (jsonError) {
    console.error('JSON load failed, no Json file found', jsonError);
  }
};
