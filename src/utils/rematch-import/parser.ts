import type {
  BattleScriptMap,
  LuaTable,
  LuaValue,
  RematchImportData,
  RematchTab,
  RematchTeam,
  PetMatchSpecialSlot,
  PetMatchTeam,
  LevellingQueue,
  LevellingQueuePetParts,
  RematchPetTagParts,
  PetMatchFolder,
  PetMatchConvertedData,
  PetMatchLevellingQueue,
  PetMatchSettings,
  PetMatchDatabase,
  RematchPreferences,
} from '@/types/rematch-import.types';

const BASE_32 = '0123456789ABCDEFGHIJKLMNOPQRSTUV';

function isLuaTable(value: LuaValue | undefined): value is LuaTable {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: LuaValue | undefined): string | null {
  return typeof value === 'string' ? value : null;
}

function asNumber(value: LuaValue | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function tableValue(
  table: LuaTable | undefined,
  key: string | number,
): LuaValue | undefined {
  return table?.[String(key)];
}

export function encodeBase32(value: number): string {
  let number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    return '';
  }

  let output = '';

  while (number > 0) {
    output = BASE_32[number % 32] + output;
    number = Math.floor(number / 32);
  }

  return output;
}

export function decodeBase32(value: string): number | null {
  if (!value.length) {
    return null;
  }

  let number = 0;

  for (const character of value.toUpperCase()) {
    const digit = BASE_32.indexOf(character);

    if (digit < 0) {
      return null;
    }

    number = number * 32 + digit;
  }

  return number;
}

export function findLuaBlock(source: string, name: string): string | null {
  const expression = new RegExp(`(?:^|\\n)\\s*${name}\\s*=\\s*\\{`);
  const match = expression.exec(source);

  if (!match) {
    return null;
  }

  const start = source.indexOf('{', match.index);

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < source.length; index++) {
    const character = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (character === '\\') {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }

      continue;
    }

    if (character === '"') {
      inString = true;
    } else if (character === '{') {
      depth++;
    } else if (character === '}') {
      depth--;

      if (depth === 0) {
        return source.slice(start, index + 1);
      }
    }
  }

  return null;
}

export function parseLuaTable(text: string): LuaTable {
  let index = 0;

  function whitespace(): void {
    while (index < text.length) {
      const character = text[index];

      if (
        character === ' ' ||
        character === '\t' ||
        character === '\n' ||
        character === '\r'
      ) {
        index++;
        continue;
      }

      if (character === '-' && text[index + 1] === '-') {
        while (index < text.length && text[index] !== '\n') {
          index++;
        }

        continue;
      }

      break;
    }
  }

  function parseString(): string {
    index++;

    let output = '';

    while (index < text.length) {
      const character = text[index];

      if (character === '\\') {
        const next = text[index + 1];

        if (next === 'n') {
          output += '\n';
          index += 2;
        } else if (next === 't') {
          output += '\t';
          index += 2;
        } else if (next === 'r') {
          output += '\r';
          index += 2;
        } else if (next !== undefined && next >= '0' && next <= '9') {
          let digits = '';

          index++;

          while (
            digits.length < 3 &&
            text[index] !== undefined &&
            text[index] >= '0' &&
            text[index] <= '9'
          ) {
            digits += text[index];
            index++;
          }

          output += String.fromCharCode(Number.parseInt(digits, 10));
        } else {
          output += next ?? '';
          index += 2;
        }
      } else if (character === '"') {
        index++;
        return output;
      } else {
        output += character;
        index++;
      }
    }

    return output;
  }

  function parseValue(): LuaValue {
    whitespace();

    const character = text[index];

    if (character === '{') {
      return parseTable();
    }

    if (character === '"') {
      return parseString();
    }

    if (text.startsWith('true', index)) {
      index += 4;
      return true;
    }

    if (text.startsWith('false', index)) {
      index += 5;
      return false;
    }

    if (text.startsWith('nil', index)) {
      index += 3;
      return null;
    }

    let end = index;

    while (end < text.length && /[-0-9.eE+]/.test(text[end])) {
      end++;
    }

    const raw = text.slice(index, end);
    index = end;

    return Number(raw);
  }

  function parseTable(): LuaTable {
    index++;

    const object: LuaTable = {};
    let positionalIndex = 1;

    for (;;) {
      whitespace();

      if (index >= text.length) {
        return object;
      }

      if (text[index] === '}') {
        index++;
        return object;
      }

      if (text[index] === ',' || text[index] === ';') {
        index++;
        continue;
      }

      if (text[index] === '[') {
        index++;
        whitespace();

        const key = text[index] === '"' ? parseString() : parseValue();

        whitespace();

        if (text[index] === ']') {
          index++;
        }

        whitespace();

        if (text[index] === '=') {
          index++;
        }

        object[String(key)] = parseValue();
      } else {
        object[String(positionalIndex)] = parseValue();
        positionalIndex++;
      }
    }
  }

  whitespace();

  return parseTable();
}

function slots(table?: LuaTable): Array<LuaValue | null> {
  return [1, 2, 3].map((slot) => tableValue(table, slot) ?? null);
}

function toList(table?: LuaTable): LuaValue[] {
  const output: LuaValue[] = [];

  let index = 1;

  while (table && tableValue(table, index) !== undefined) {
    output.push(tableValue(table, index) as LuaValue);
    index++;
  }

  return output;
}

function encodeRematchPreferences(preferences: RematchPreferences): string {
  const { minHP, allowMM, expectedDD, maxHP, minXP, maxXP } = preferences;

  const hasPreferences = [minHP, allowMM, expectedDD, maxHP, minXP, maxXP].some(
    (value) => value !== undefined,
  );

  if (!hasPreferences) {
    return '';
  }

  return `P:${minHP ?? ''}:${allowMM ? '1' : ''}:${expectedDD ?? ''}:${maxHP ?? ''}:${minXP ?? ''}:${maxXP ?? ''}:`;
}

function escapeNotes(value: string): string {
  return value
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n/g, '\\n');
}

function wrapScript(code: string): string {
  return [
    '-----BEGIN PET BATTLE SCRIPT-----',
    code,
    '-----END PET BATTLE SCRIPT-----',
  ].join('\n');
}

export function parseBattleScripts(source: string): BattleScriptMap | null {
  const text = source.replace(/\r\n/g, '\n');
  const block = findLuaBlock(text, 'TD_DB_BATTLEPETSCRIPT_GLOBAL');

  if (!block) {
    return null;
  }

  const database = parseLuaTable(block);
  const global = database.global;

  if (!isLuaTable(global)) {
    return {};
  }

  const scripts = global.scripts;

  if (!isLuaTable(scripts)) {
    return {};
  }

  const rematch = scripts.Rematch;

  if (!isLuaTable(rematch)) {
    return {};
  }

  const map: BattleScriptMap = {};

  for (const [key, value] of Object.entries(rematch)) {
    if (!isLuaTable(value)) {
      continue;
    }

    const code = asString(value.code);

    if (!code?.trim()) {
      continue;
    }

    map[key] = code.trim();
  }

  return map;
}

export function decodeRematchPetTag(tag: string): RematchPetTagParts | null {
  if (!tag) {
    return null;
  }

  if (tag === 'ZL') {
    return {
      type: 'leveling',
      rawPetTag: tag,
    };
  }

  if (tag.startsWith('ZR')) {
    const petType = decodeBase32(tag.slice(2));

    if (petType === null) {
      return null;
    }

    return {
      type: 'random',
      petType,
      rawPetTag: tag,
    };
  }

  if (tag.length < 5) {
    return null;
  }

  const ability1 = decodeBase32(tag.charAt(0));
  const ability2 = decodeBase32(tag.charAt(1));
  const ability3 = decodeBase32(tag.charAt(2));
  const breed = decodeBase32(tag.charAt(3));
  const species = decodeBase32(tag.slice(4));

  if (
    ability1 === null ||
    ability2 === null ||
    ability3 === null ||
    breed === null ||
    species === null
  ) {
    return null;
  }

  return {
    type: 'pet',
    abilities: [ability1, ability2, ability3],
    breed,
    species,
  };
}

export function buildRematchData(
  source: string,
  scriptMap: BattleScriptMap = {},
): RematchImportData | null {
  const text = source.replace(/\r\n/g, '\n');
  const queue = buildLevellingQueue(text);
  const teamBlock = findLuaBlock(text, 'Rematch5SavedTeams');

  if (!teamBlock) {
    if (queue) {
      return {
        tabs: [],
        teamCount: 0,
        scripted: 0,
        queue,
      };
    }
    return null;
  }

  const rawTeams = parseLuaTable(teamBlock);
  const teamsById: Record<string, RematchTeam> = {};

  let scripted = 0;

  for (const [id, value] of Object.entries(rawTeams)) {
    if (!isLuaTable(value)) {
      continue;
    }

    const targetsTable = isLuaTable(value.targets) ? value.targets : undefined;
    const tagsTable = isLuaTable(value.tags) ? value.tags : undefined;
    const petsTable = isLuaTable(value.pets) ? value.pets : undefined;

    const targets = slots(targetsTable)
      .map((target) => (asNumber(target) ? target : null))
      .filter((target): target is number => target !== null);

    const petTags = slots(tagsTable).map((tag) =>
      typeof tag === 'string' ? tag : '',
    );

    const pets = slots(petsTable).map((pet) =>
      typeof pet === 'string' ? pet : '',
    );

    const decodedPetTags = petTags.map((tag) =>
      tag ? decodeRematchPetTag(tag) : null,
    );

    const breeds = decodedPetTags.map((decoded) =>
      decoded?.type === 'pet' ? decoded.breed : null,
    );

    const name = asString(value.name) ?? '(unnamed team)';
    let notes = asString(value.notes)?.trim() ?? '';

    const npcId = targets[0] ?? null;
    const npc = npcId !== null ? encodeBase32(npcId) : '';

    let code = scriptMap[id];

    if (!code && npcId !== null) {
      code = scriptMap[String(npcId)];
    }

    if (code) {
      const wrappedScript = wrapScript(code);

      notes = notes ? `${notes}\n\n${wrappedScript}` : wrappedScript;

      scripted++;
    }

    const preferences = parseRematchPreferences(value.preferences);
    const preferencesExport = encodeRematchPreferences(preferences);

    let importString = [
      name,
      npc,
      petTags[0] ?? '',
      petTags[1] ?? '',
      petTags[2] ?? '',
      '',
    ].join(':');

    if (preferencesExport) {
      importString += `:${preferencesExport}`;
    }

    if (notes) {
      importString += `:N:${escapeNotes(notes)}`;
    }

    teamsById[id] = {
      id,
      name,
      npc,
      npcId,
      extraTargets: Math.max(targets.length - 1, 0),

      pets,
      petTags,
      decodedPetTags,
      breeds,
      abilities: [],
      preferences: parseRematchPreferences(value.preferences),
      groupId: asString(value.groupID) ?? String(value.groupID ?? ''),

      hasScript: Boolean(code),
      script: code?.trim() ?? '',

      importString,
    };
  }

  const groupBlock = findLuaBlock(text, 'Rematch5SavedGroups');

  const rawGroups = groupBlock ? parseLuaTable(groupBlock) : {};

  const tabs: RematchTab[] = [];
  const claimed = new Set<string>();

  for (const [groupId, value] of Object.entries(rawGroups)) {
    if (!isLuaTable(value)) {
      continue;
    }

    if (value.meta === true) {
      continue;
    }

    const ordered: RematchTeam[] = [];

    const groupTeams = isLuaTable(value.teams) ? value.teams : undefined;

    for (const teamIdValue of toList(groupTeams)) {
      const teamId = String(teamIdValue);
      const team = teamsById[teamId];

      if (!team) {
        continue;
      }

      ordered.push(team);
      claimed.add(teamId);
    }

    for (const [teamId, team] of Object.entries(teamsById)) {
      if (!claimed.has(teamId) && team.groupId === groupId) {
        ordered.push(team);
        claimed.add(teamId);
      }
    }

    if (!ordered.length) {
      continue;
    }

    const tabName = asString(value.name) ?? groupId;

    tabs.push({
      id: groupId,
      name: tabName,
      color: asString(value.color) ?? null,

      teams: [...ordered].sort((a, b) => a.name.localeCompare(b.name)),

      exportBlock: [
        `__ ${tabName} __`,
        '',
        ...ordered.map((team) => team.importString),
      ].join('\n'),
    });
  }

  const orphans = Object.entries(teamsById)
    .filter(([teamId]) => !claimed.has(teamId))
    .map(([, team]) => team)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (orphans.length) {
    const tabName = 'Unsorted';
    tabs.push({
      id: 'unfiled',
      name: tabName,
      color: null,
      teams: orphans,
      exportBlock: [
        `__ ${tabName} __`,
        '',
        ...orphans.map((team) => team.importString),
      ].join('\n'),
    });
  }

  return {
    tabs,
    teamCount: Object.keys(teamsById).length,
    scripted,
    queue,
  };
}

function findBalancedBlock(source: string, start: number): string | null {
  const braceStart = source.indexOf('{', start);

  if (braceStart === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = braceStart; index < source.length; index++) {
    const character = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (character === '\\') {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }

      continue;
    }

    if (character === '"') {
      inString = true;
    } else if (character === '{') {
      depth++;
    } else if (character === '}') {
      depth--;

      if (depth === 0) {
        return source.slice(braceStart, index + 1);
      }
    }
  }

  return null;
}

function findKeyBlock(source: string, key: string): string | null {
  const expression = new RegExp(`\\[\\s*"${key}"\\s*\\]\\s*=\\s*\\{`);

  const match = expression.exec(source);

  if (!match) {
    return null;
  }

  return findBalancedBlock(source, match.index);
}

export function decodeQueueTag(tag: string): LevellingQueuePetParts | null {
  if (!tag || tag.length < 5 || !tag.startsWith('Q')) {
    return null;
  }

  const level = decodeBase32(tag.charAt(1));
  const rarity = decodeBase32(tag.charAt(2));
  const breed = decodeBase32(tag.charAt(3));
  const species = decodeBase32(tag.slice(4));

  if (level === null || rarity === null || breed === null || species === null) {
    return null;
  }

  return {
    species,
    breed,
    level,
    rarity,
  };
}

export function buildLevellingQueue(source: string): LevellingQueue | null {
  const settingsBlock = findLuaBlock(source, 'Rematch5Settings');

  if (!settingsBlock) {
    return null;
  }

  const queueBlock = findKeyBlock(settingsBlock, 'LevelingQueue');

  if (!queueBlock) {
    return null;
  }

  const table = parseLuaTable(queueBlock);

  const pets = toList(table)
    .filter(isLuaTable)
    .flatMap((entry) => {
      const petID = asString(entry.petID);
      const petTag = asString(entry.petTag);

      if (!petID || !petTag) {
        return [];
      }

      return [
        {
          petID,
          tag: petTag,
          parts: decodeQueueTag(petTag),
          added: asString(entry.added) ?? '',
          preferred: entry.preferred === true,
        },
      ];
    });

  return {
    pets,
  };
}

function createPetMatchId(): string {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
}

function buildPetMatchLevellingQueue(
  queue: LevellingQueue | null,
): PetMatchLevellingQueue {
  const pets = queue?.pets.map((pet) => pet.petID).filter(Boolean) ?? [];

  return {
    pets,
    initialized: true,
    knownPets: {},
  };
}

function buildDefaultPetMatchSettings(): PetMatchSettings {
  return {
    scale: 1,
    debug: false,
    selectedFolderKey: '__UNSORTED__',
    selectedTeamID: null,
    teamSortMode: 'name',

    ui: {
      theme: 'dark',
      petCardBackground: 'marble',
      compactPetListRows: false,
      teamCardHeightMode: 'normal',
      petTypeFilterDisplayMode: 'both',
      petListBreedPosition: 'right',
    },

    duplicateTeamMode: 'replace',
    petCardInteractionMode: 'hover',
    petCardPetListEnabled: true,
    petCardTeamsEnabled: true,
    petCardLevellingQueueEnabled: true,
    petCardTargetEnabled: true,
    levellingQueueAutoAddMode: 'disabled',
    summonedPetMode: 'keep',
    restorePreviousSummonedPet: false,
    autoOpenNotesOnPvEBattle: false,
    autoOpenPetJournalAfterBattle: true,
    statusBarClearMode: 'all',
    targetTeamLoadMode: 'off',
  };
}

export function buildPetMatchDatabase(
  data: RematchImportData,
): PetMatchDatabase {
  const converted = buildPetMatchData(data);

  return {
    version: 1,
    cache: {},
    characters: {},
    profileKeys: {},
    global: {
      settings: {},
    },
    profiles: {
      Default: {
        folders: converted.folders,
        teams: converted.teams,
        levellingQueue: converted.levellingQueue,
        settings: buildDefaultPetMatchSettings(),
        activeTeam: {},
        tags: {},
        favorites: {},
      },
    },
  };
}

export function buildPetMatchTeam(
  team: RematchTeam,
  folderID: string,
  timestamp = Math.floor(Date.now() / 1000),
): PetMatchTeam {
  const specialSlots: Record<number, PetMatchSpecialSlot> = {};

  team.decodedPetTags.forEach((tag, index) => {
    if (!tag) return;

    const slot = index + 1;

    if (tag.type === 'leveling') {
      specialSlots[slot] = {
        type: 'leveling',
        rawPetTag: tag.rawPetTag,
        ...(team.preferences.minXP !== undefined && {
          minimumLevel: team.preferences.minXP,
        }),
        ...(team.preferences.maxXP !== undefined && {
          maximumLevel: team.preferences.maxXP,
        }),
        ...(team.preferences.minHP !== undefined && {
          minimumHealth: team.preferences.minHP,
        }),
      };

      return;
    }

    if (tag.type === 'random') {
      specialSlots[slot] = {
        type: 'random',
        petType: tag.petType,
        rawPetTag: tag.rawPetTag,
      };
    }
  });

  const pets = team.pets.filter(
    (pet, index) => pet && team.decodedPetTags[index]?.type === 'pet',
  );

  const breeds = team.breeds.filter((breed): breed is number => breed !== null);

  return {
    id: createPetMatchId(),
    name: team.name,
    pets,
    breeds,
    abilities: team.abilities,
    preferences: team.preferences,
    folderID,
    specialSlots,
    targetNPCIDs: team.npcId !== null ? [team.npcId] : [],
    script: team.script,
    notes: '',
    description: '',
    strategy: '',
    tags: [],
    favorite: false,
    importSource: 'rematch',
    createdBy: 'PetMatch',
    created: timestamp,
    modified: timestamp,
  };
}

export function buildPetMatchData(
  data: RematchImportData,
): PetMatchConvertedData {
  const now = Math.floor(Date.now() / 1000);

  const folders: Record<string, PetMatchFolder> = {};
  const teams: Record<string, PetMatchTeam> = {};

  data.tabs.forEach((tab, tabIndex) => {
    const folderID = createPetMatchId();

    folders[folderID] = {
      id: folderID,
      name: tab.name,
      order: tabIndex + 1,
      created: now,
      modified: now,
    };

    for (const team of tab.teams) {
      const petMatchTeam = buildPetMatchTeam(team, folderID, now);

      teams[petMatchTeam.id] = petMatchTeam;
    }
  });

  return {
    folders,
    teams,
    levellingQueue: buildPetMatchLevellingQueue(data.queue),
  };
}

function parseRematchPreferences(value: LuaValue): RematchPreferences {
  if (!isLuaTable(value)) {
    return {};
  }

  const preferences: RematchPreferences = {};

  const numericKeys = [
    'minHP',
    'expectedDD',
    'maxHP',
    'minXP',
    'maxXP',
  ] as const;

  for (const key of numericKeys) {
    const number = asNumber(value[key]);

    if (number !== null) {
      preferences[key] = number;
    }
  }

  if (typeof value.allowMM === 'boolean') {
    preferences.allowMM = value.allowMM;
  }

  return preferences;
}
