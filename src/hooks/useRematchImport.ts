'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  buildPetMatchDatabase,
  buildRematchData,
  parseBattleScripts,
} from '@/utils/rematch-import/parser';
import { buildPmqQueueExport } from '@/utils/rematch-import/queue-export';

import type {
  PmqQueueExport,
  RematchImportData,
  RematchSources,
  UseRematchImportResult,
} from '@/types/rematch-import.types';

import { getPetTypesBySpeciesIds } from '@/actions/supabase/pets-schema/pets/getPets';
import { addAbilitiesToRematchData } from '@/utils/rematch-import/resolve-pet-abilities';
import { serializePetMatchDatabase } from '@/utils/rematch-import/petmatch-lua-serializer';

const initialSources: RematchSources = {
  teams: null,
  scripts: null,
  teamsName: '',
  scriptsName: '',
};

function readFile(file: File): Promise<string> {
  return file.text();
}

export function useRematchImport(): UseRematchImportResult {
  const [sources, setSources] = useState<RematchSources>(initialSources);
  const [data, setData] = useState<RematchImportData | null>(null);
  const [queueExport, setQueueExport] = useState<PmqQueueExport | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [petMatchLua, setPetMatchLua] = useState('');

  const rebuild = useCallback(async (nextSources: RematchSources) => {
    setError(null);
    setQueueExport(null);
    setPetMatchLua('');

    if (!nextSources.teams) {
      setData(null);

      setStatus(
        `Loaded ${nextSources.scriptsName}. Add Rematch.lua to generate the import strings.`,
      );

      return;
    }

    try {
      const scriptMap = nextSources.scripts
        ? (parseBattleScripts(nextSources.scripts) ?? {})
        : {};

      const parsed = buildRematchData(nextSources.teams, scriptMap);

      if (!parsed) {
        setData(null);
        setError('No usable Rematch SavedVariables were found.');
        return;
      }

      const enriched = await addAbilitiesToRematchData(parsed);
      const petMatchDatabase = buildPetMatchDatabase(enriched);
      const petMatchLua = serializePetMatchDatabase(petMatchDatabase);

      setPetMatchLua(petMatchLua);
      setData(enriched);

      if (parsed.queue && parsed.queue.pets.length) {
        const speciesIds = parsed.queue.pets.flatMap((pet) =>
          pet.parts ? [pet.parts.species] : [],
        );

        const petTypes = await getPetTypesBySpeciesIds(speciesIds);
        if (!petTypes.success || !petTypes.data) {
          throw new Error(petTypes.error ?? 'Could not retrieve pet types.');
        }
        const exportData = buildPmqQueueExport(parsed.queue, petTypes.data);

        setQueueExport(exportData);
      }

      const queueCount = parsed.queue?.pets.length ?? 0;

      let message = `${parsed.teamCount} ${
        parsed.teamCount === 1 ? 'team' : 'teams'
      } across ${parsed.tabs.length} ${
        parsed.tabs.length === 1 ? 'tab' : 'tabs'
      }`;

      if (nextSources.scripts) {
        message += `, ${parsed.scripted} with a battle script`;
      }

      message += `. ${queueCount} ${
        queueCount === 1 ? 'pet' : 'pets'
      } in the levelling queue.`;

      setStatus(message);
    } catch (cause) {
      console.error(cause);

      setData(null);
      setQueueExport(null);
      setPetMatchLua('');

      setError(
        cause instanceof Error
          ? cause.message
          : 'The SavedVariables could not be processed.',
      );
    }
  }, []);

  const handleFiles = useCallback(
    async (input: FileList | File[]) => {
      const files = Array.from(input);

      if (!files.length) {
        return;
      }

      setIsReading(true);
      setError(null);
      setStatus('Reading…');

      try {
        const nextSources = {
          ...sources,
        };

        const unknown: string[] = [];

        const contents = await Promise.all(
          files.map(async (file) => ({
            file,
            text: await readFile(file),
          })),
        );

        for (const { file, text } of contents) {
          if (text.includes('Rematch5SavedTeams')) {
            nextSources.teams = text;
            nextSources.teamsName = file.name;
          } else if (text.includes('TD_DB_BATTLEPETSCRIPT_GLOBAL')) {
            nextSources.scripts = text;
            nextSources.scriptsName = file.name;
          } else {
            unknown.push(file.name);
          }
        }

        if (unknown.length && !nextSources.teams && !nextSources.scripts) {
          setData(null);

          setError(
            `Nothing recognised in ${unknown.join(
              ', ',
            )}. Expected Rematch.lua or tdBattlePetScript.lua.`,
          );

          return;
        }

        setSources(nextSources);
        await rebuild(nextSources);
      } catch (cause) {
        console.error('Unable to read SavedVariables:', cause);

        setError('One or more files could not be read.');
      } finally {
        setIsReading(false);
      }
    },
    [rebuild, sources],
  );

  const filteredTabs = useMemo(() => {
    if (!data) {
      return [];
    }

    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return data.tabs;
    }

    return data.tabs
      .map((tab) => ({
        ...tab,
        teams: tab.teams.filter((team) => {
          return (
            team.name.toLowerCase().includes(normalizedQuery) ||
            team.npc.toLowerCase().includes(normalizedQuery) ||
            (team.npcId !== null &&
              String(team.npcId).includes(normalizedQuery))
          );
        }),
      }))
      .filter((tab) => tab.teams.length > 0);
  }, [data, query]);

  const shownTeamCount = useMemo(
    () => filteredTabs.reduce((total, tab) => total + tab.teams.length, 0),
    [filteredTabs],
  );

  return {
    data,
    queueExport,
    petMatchLua,
    query,
    setQuery,
    status,
    error,
    isReading,
    filteredTabs,
    shownTeamCount,
    handleFiles,
  };
}
