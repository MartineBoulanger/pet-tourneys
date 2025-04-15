-- table for tournaments
CREATE TABLE api.tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NULL DEFAULT '1999-12-31 23:00:00',
  participant_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE api.tournaments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read access for all users" ON api.tournaments FOR
SELECT TO authenticated,
  anon USING (true);

CREATE POLICY "Insert access for admins" ON api.tournaments FOR
INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1
      FROM api.profil
      WHERE id = auth.uid()
        AND role = 'admin'
    )
  );

CREATE POLICY "Update access for admins" ON api.tournaments FOR
UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1
      FROM api.profiles
      WHERE id = auth.uid()
        AND role = 'admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1
      FROM api.profiles
      WHERE id = auth.uid()
        AND role = 'admin'
    )
  );

CREATE POLICY "Delete access for admins" ON api.tournaments FOR DELETE TO authenticated USING (
  EXISTS (
    SELECT 1
    FROM api.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  )
);

