import { BattleLog, BattleRound } from '@/types';

export function parseBattleLog(rawLog: string) {
  const battles = rawLog.split(
    '-------------------------------------------------------------------------------------------'
  );
  const parsedBattles: BattleLog[] = [];

  for (const battle of battles) {
    if (!battle.trim()) continue;

    const parsedBattle = {
      battle: [] as BattleRound[],
    } as BattleLog;

    // More flexible timestamp matching
    const timestampMatch = battle.match(
      /Timestamp: (?:day: )?(\d{2}-\d{2}-\d{4})[^0-9]*(\d{2}:\d{2}:\d{2})(?:\s*([AP]M))?/i
    );

    if (!timestampMatch) {
      console.error(
        'Timestamp match failed. Battle content:',
        battle.slice(0, 200) + '...'
      );
      throw new Error(
        'Invalid timestamp format. Expected format like "Timestamp: day: MM-DD-YYYY | time: HH:MM:SS"'
      );
    }

    // Extract date and time parts
    const dateStr = timestampMatch[1]; // "11-30-2024" or "30-11-2024"
    const timeStr = timestampMatch[2]; // "07:34:08" or "19:15:07"
    const period = timestampMatch[3]; // "AM" or "PM" or undefined

    // Split date into parts
    // Parse date (handles both US and international formats)
    const dateParts = dateStr.split('-').map(Number); // Changed to const
    if (dateParts.length !== 3) {
      throw new Error(
        `Invalid date format (expected dd-MM-yyyy or MM-dd-yyyy): ${dateStr}`
      );
    }

    let day: number, month: number, year: number;
    // Check if format is US (Month first)
    if (dateParts[0] > 12) {
      // First part > 12 → must be day (international format DD-MM-YYYY)
      [day, month, year] = dateParts;
    } else if (dateParts[1] > 12) {
      // Second part > 12 → must be day (US format MM-DD-YYYY)
      [month, day, year] = dateParts;
    } else {
      // Ambiguous case - default to US format (MM-DD-YYYY)
      [month, day, year] = dateParts;
    }

    // Validate parsed date
    if (month > 12 || day > 31) {
      throw new Error(`Invalid date values (month: ${month}, day: ${day})`);
    }

    // Parse time (handle 12/24 hour formats)
    const [hours, minutes, seconds] = timeStr.split(':').map(Number); // Changed to const
    let adjustedHours = hours;

    if (period) {
      // Convert 12-hour to 24-hour format
      if (period.toLowerCase() === 'pm' && hours < 12) {
        adjustedHours += 12;
      } else if (period.toLowerCase() === 'am' && hours === 12) {
        adjustedHours = 0;
      }
    }

    // Create Date object
    const dateObj = new Date(
      year,
      month - 1, // months are 0-indexed
      day,
      adjustedHours,
      minutes,
      seconds
    );

    if (isNaN(dateObj.getTime())) {
      throw new Error(
        `Failed to create valid date from: ${dateStr} ${timeStr}`
      );
    }

    // Store as ISO string
    parsedBattle.timestamp = dateObj.toISOString();

    const resultMatch = battle.match(/Result: (\w+)/);
    if (resultMatch) parsedBattle.result = resultMatch[1];

    const durationMatch = battle.match(/Duration: (.+)/);
    if (durationMatch) parsedBattle.duration = durationMatch[1].trim();

    const roundsMatch = battle.match(/Rounds: (\d+)/);
    if (roundsMatch) parsedBattle.rounds = parseInt(roundsMatch[1]);

    const playerTeamMatch = battle.match(/Player's Team: ([^\n]+)/);
    if (playerTeamMatch) {
      parsedBattle.player_team = playerTeamMatch[1]
        .split(', ')
        .map((pet) => pet.trim());
    }

    const opponentTeamMatch = battle.match(/Opponent's Team: ([^\n]+)/);
    if (opponentTeamMatch) {
      parsedBattle.opponent_team = opponentTeamMatch[1]
        .split(', ')
        .map((pet) => pet.trim());
    }

    // Parse rounds
    const roundSections = battle.split('Round ');
    for (let i = 1; i < roundSections.length; i++) {
      const roundEvents = roundSections[i]
        .split('\n')
        .filter((line) => line.trim() && !line.match(/Round \d+/))
        .map((line) => line.trim());

      parsedBattle.battle.push({
        round: i,
        events: roundEvents,
      });
    }

    parsedBattles.push(parsedBattle);
  }

  return parsedBattles;
}
