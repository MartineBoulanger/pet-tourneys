import type {
  PetMatchDatabase,
  ResolvedPetAbilities,
} from '@/types/rematch-import.types';

function indent(level: number): string {
  return '  '.repeat(level);
}

function escapeLuaString(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

function serializePrimitive(value: string | number | boolean): string {
  if (typeof value === 'string') {
    return `"${escapeLuaString(value)}"`;
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  return String(value);
}

function serializeAbilityArray(
  abilities: ResolvedPetAbilities,
  level: number,
): string {
  const lines: string[] = ['{'];

  abilities.forEach((ability, index) => {
    if (ability === null) {
      return;
    }

    lines.push(`${indent(level + 1)}[${index + 1}] = ${ability},`);
  });

  lines.push(`${indent(level)}}`);

  return lines.join('\n');
}

function serializeArray(values: unknown[], level: number): string {
  if (!values.length) {
    return '{}';
  }

  const lines: string[] = ['{'];

  values.forEach((value, index) => {
    lines.push(
      `${indent(level + 1)}[${index + 1}] = ${serializeLuaValue(
        value,
        level + 1,
      )},`,
    );
  });

  lines.push(`${indent(level)}}`);

  return lines.join('\n');
}

function serializeObject(
  value: Record<string, unknown>,
  level: number,
  parentKey?: string,
): string {
  const entries = Object.entries(value);

  if (!entries.length) {
    return '{}';
  }

  const lines: string[] = ['{'];

  for (const [key, entryValue] of entries) {
    const luaKey =
      parentKey === 'specialSlots' && /^\d+$/.test(key)
        ? `[${key}]`
        : `["${escapeLuaString(key)}"]`;

    lines.push(
      `${indent(level + 1)}${luaKey} = ${serializeLuaValue(
        entryValue,
        level + 1,
        key,
      )},`,
    );
  }

  lines.push(`${indent(level)}}`);

  return lines.join('\n');
}

function serializeLuaValue(
  value: unknown,
  level: number,
  key?: string,
): string {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return serializePrimitive(value);
  }

  if (value === null || value === undefined) {
    return 'nil';
  }

  if (Array.isArray(value)) {
    if (key === 'abilities') {
      return serializeArray(
        value.map((abilities) => ({
          __abilityArray: abilities,
        })),
        level,
      );
    }

    return serializeArray(value, level);
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;

    if ('__abilityArray' in record) {
      return serializeAbilityArray(
        record.__abilityArray as ResolvedPetAbilities,
        level,
      );
    }

    return serializeObject(record, level, key);
  }

  return 'nil';
}

export function serializePetMatchDatabase(database: PetMatchDatabase): string {
  return `PetMatchDB = ${serializeLuaValue(database, 0)}\n`;
}
