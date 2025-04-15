-- function that creates new tables that are linked to the newly created tournament
CREATE OR REPLACE FUNCTION api.manage_tournament_tables(
    action TEXT, -- 'create' or 'drop'
    tournament_id UUID
  ) RETURNS void AS $$
DECLARE table_suffix TEXT := replace(tournament_id::text, '-', '');
matches_table TEXT := 'matches_' || table_suffix;
battle_logs_table TEXT := 'battle_logs_' || table_suffix;
pet_usage_table TEXT := 'pet_usage_' || table_suffix;
tournament_stats_table TEXT := 'tournament_pet_stats_' || table_suffix;
BEGIN IF action = 'create' THEN -- Create matches table
EXECUTE format(
  'CREATE TABLE IF NOT EXISTS api.%I (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      region TEXT NOT NULL,
      player1 TEXT NOT NULL,
      player2 TEXT NOT NULL,
      owner TEXT NOT NULL,
      date TIMESTAMP NOT NULL,
      owner_score INTEGER DEFAULT 0,
      opponent_score INTEGER DEFAULT 0,
      outcome VARCHAR(10) CHECK (outcome IN (''WIN'', ''LOSS'', ''DRAW'')),
      created_at TIMESTAMP DEFAULT NOW()
    )',
  matches_table
);
EXECUTE format(
  'GRANT SELECT ON TABLE api.%I TO anon',
  matches_table
);
EXECUTE format(
  'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE api.%I TO authenticated',
  matches_table
);
EXECUTE format(
  'ALTER TABLE api.%I ENABLE ROW LEVEL SECURITY',
  matches_table
);
EXECUTE format(
  'CREATE POLICY "Public matches access" ON api.%I FOR SELECT USING (true)',
  matches_table
);
EXECUTE format(
  'CREATE POLICY "Admin matches access" ON api.%I FOR ALL USING (
      EXISTS (SELECT 1 FROM api.profiles WHERE id = auth.uid() AND role = ''admin'')
    )',
  matches_table
);
-- Create battle logs table
EXECUTE format(
  'CREATE TABLE IF NOT EXISTS api.%I (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      match_id UUID NOT NULL REFERENCES api.%I(id) ON DELETE CASCADE,
      timestamp TIMESTAMPTZ NOT NULL,
      result TEXT NOT NULL,
      duration TEXT NOT NULL,
      rounds INTEGER NOT NULL,
      player_team TEXT[] NOT NULL,
      opponent_team TEXT[] NOT NULL,
      battle JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )',
  battle_logs_table,
  matches_table
);
EXECUTE format(
  'GRANT SELECT ON TABLE api.%I TO anon',
  battle_logs_table
);
EXECUTE format(
  'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE api.%I TO authenticated',
  battle_logs_table
);
EXECUTE format(
  'ALTER TABLE api.%I ENABLE ROW LEVEL SECURITY',
  battle_logs_table
);
EXECUTE format(
  'CREATE POLICY "Public battle logs access" ON api.%I FOR SELECT USING (true)',
  battle_logs_table
);
EXECUTE format(
  'CREATE POLICY "Admin battle logs access" ON api.%I FOR ALL USING (
      EXISTS (SELECT 1 FROM api.profiles WHERE id = auth.uid() AND role = ''admin'')
    )',
  battle_logs_table
);
-- Create pet usage table
EXECUTE format(
  'CREATE TABLE IF NOT EXISTS api.%I (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      match_id UUID NOT NULL REFERENCES api.%I(id) ON DELETE CASCADE,
      pet_data JSONB NOT NULL,
      total_played INTEGER NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW(),
      created_at TIMESTAMP DEFAULT NOW()
    )',
  pet_usage_table,
  matches_table
);
EXECUTE format(
  'GRANT SELECT ON TABLE api.%I TO anon',
  pet_usage_table
);
EXECUTE format(
  'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE api.%I TO authenticated',
  pet_usage_table
);
EXECUTE format(
  'ALTER TABLE api.%I ENABLE ROW LEVEL SECURITY',
  pet_usage_table
);
EXECUTE format(
  'CREATE POLICY "Public pet usage access" ON api.%I FOR SELECT USING (true)',
  pet_usage_table
);
EXECUTE format(
  'CREATE POLICY "Admin pet usage access" ON api.%I FOR ALL USING (
      EXISTS (SELECT 1 FROM api.profiles WHERE id = auth.uid() AND role = ''admin'')
    )',
  pet_usage_table
);
-- Create tournament stats table
EXECUTE format(
  'CREATE TABLE IF NOT EXISTS api.%I (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      tournament_id UUID NOT NULL,
      pet_data JSONB NOT NULL,
      total_played INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )',
  tournament_stats_table
);
EXECUTE format(
  'GRANT SELECT ON TABLE api.%I TO anon',
  tournament_stats_table
);
EXECUTE format(
  'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE api.%I TO authenticated',
  tournament_stats_table
);
EXECUTE format(
  'ALTER TABLE api.%I ENABLE ROW LEVEL SECURITY',
  tournament_stats_table
);
EXECUTE format(
  'CREATE POLICY "Public tournament stats access" ON api.%I FOR SELECT USING (true)',
  tournament_stats_table
);
EXECUTE format(
  'CREATE POLICY "Admin tournament stats access" ON api.%I FOR ALL USING (
      EXISTS (SELECT 1 FROM api.profiles WHERE id = auth.uid() AND role = ''admin'')
    )',
  tournament_stats_table
);
EXECUTE format(
  'CREATE POLICY "Service role full access" ON api.%I FOR ALL USING (true) WITH CHECK (true)',
  tournament_stats_table
);
-- Create indexes
EXECUTE format(
  'CREATE INDEX IF NOT EXISTS idx_%s_name ON api.%I ((pet_data->>''name''))',
  table_suffix,
  tournament_stats_table
);
EXECUTE format(
  'CREATE INDEX IF NOT EXISTS idx_%s_tournament ON api.%I (tournament_id)',
  table_suffix,
  tournament_stats_table
);
ELSIF action = 'drop' THEN EXECUTE format(
  'DROP TABLE IF EXISTS api.%I CASCADE',
  tournament_stats_table
);
EXECUTE format(
  'DROP TABLE IF EXISTS api.%I CASCADE',
  pet_usage_table
);
EXECUTE format(
  'DROP TABLE IF EXISTS api.%I CASCADE',
  battle_logs_table
);
EXECUTE format(
  'DROP TABLE IF EXISTS api.%I CASCADE',
  matches_table
);
ELSE RAISE EXCEPTION 'Invalid action: % (use "create" or "drop")',
action;
END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;