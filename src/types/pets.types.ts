export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PetsDB = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<PetsDB, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  pets: {
    Tables: {
      pets: {
        Row: {
          ability_1: string | null;
          ability_2: string | null;
          ability_3: string | null;
          ability_4: string | null;
          ability_5: string | null;
          ability_6: string | null;
          base_health: number | null;
          base_power: number | null;
          base_speed: number | null;
          breeds: PetsDB['pets']['Enums']['breeds'][] | null;
          description: string | null;
          expansion: PetsDB['pets']['Enums']['expansions'];
          icon: Json | null;
          id: number;
          image: Json | null;
          is_alliance: boolean | null;
          is_capturable: boolean | null;
          is_horde: boolean | null;
          is_tradable: boolean | null;
          is_vanity: boolean | null;
          name: string;
          source: PetsDB['pets']['Enums']['sources'] | null;
          type: PetsDB['pets']['Enums']['types'];
        };
        Insert: {
          ability_1?: string | null;
          ability_2?: string | null;
          ability_3?: string | null;
          ability_4?: string | null;
          ability_5?: string | null;
          ability_6?: string | null;
          base_health?: number | null;
          base_power?: number | null;
          base_speed?: number | null;
          breeds?: PetsDB['pets']['Enums']['breeds'][] | null;
          description?: string | null;
          expansion: PetsDB['pets']['Enums']['expansions'];
          icon?: Json | null;
          id: number;
          image?: Json | null;
          is_alliance?: boolean | null;
          is_capturable?: boolean | null;
          is_horde?: boolean | null;
          is_tradable?: boolean | null;
          is_vanity?: boolean | null;
          name: string;
          source?: PetsDB['pets']['Enums']['sources'] | null;
          type: PetsDB['pets']['Enums']['types'];
        };
        Update: {
          ability_1?: string | null;
          ability_2?: string | null;
          ability_3?: string | null;
          ability_4?: string | null;
          ability_5?: string | null;
          ability_6?: string | null;
          base_health?: number | null;
          base_power?: number | null;
          base_speed?: number | null;
          breeds?: PetsDB['pets']['Enums']['breeds'][] | null;
          description?: string | null;
          expansion?: PetsDB['pets']['Enums']['expansions'];
          icon?: Json | null;
          id?: number;
          image?: Json | null;
          is_alliance?: boolean | null;
          is_capturable?: boolean | null;
          is_horde?: boolean | null;
          is_tradable?: boolean | null;
          is_vanity?: boolean | null;
          name?: string;
          source?: PetsDB['pets']['Enums']['sources'] | null;
          type?: PetsDB['pets']['Enums']['types'];
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      breeds:
        | 'S/S'
        | 'P/P'
        | 'H/H'
        | 'B/B'
        | 'P/S'
        | 'S/B'
        | 'P/B'
        | 'H/S'
        | 'H/P'
        | 'H/B';
      expansions:
        | 'Classic'
        | 'The Burning Crusade'
        | 'Wrath of the Lich King'
        | 'Cataclysm'
        | 'Mists of Pandaria'
        | 'Warlords of Draenor'
        | 'Legion'
        | 'Battle for Azeroth'
        | 'Shadowlands'
        | 'Dragonflight'
        | 'The War Within'
        | 'Midnight';
      sources:
        | 'Achievement'
        | 'Discovery'
        | 'Drop'
        | 'In-Game Shop'
        | 'Pet Battle'
        | 'Profession'
        | 'Promotion'
        | 'Quest'
        | 'Trading Card Game'
        | 'Trading Post'
        | 'Vendor'
        | 'World Event';
      types:
        | 'Beast'
        | 'Mechanical'
        | 'Flying'
        | 'Dragonkin'
        | 'Aquatic'
        | 'Critter'
        | 'Humanoid'
        | 'Magic'
        | 'Elemental'
        | 'Undead';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<PetsDB, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof PetsDB, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  pets: {
    Enums: {
      breeds: [
        'S/S',
        'P/P',
        'H/H',
        'B/B',
        'P/S',
        'S/B',
        'P/B',
        'H/S',
        'H/P',
        'H/B',
      ],
      expansions: [
        'Classic',
        'The Burning Crusade',
        'Wrath of the Lich King',
        'Cataclysm',
        'Mists of Pandaria',
        'Warlords of Draenor',
        'Legion',
        'Battle for Azeroth',
        'Shadowlands',
        'Dragonflight',
        'The War Within',
        'Midnight',
      ],
      sources: [
        'Achievement',
        'Discovery',
        'Drop',
        'In-Game Shop',
        'Pet Battle',
        'Profession',
        'Promotion',
        'Quest',
        'Trading Card Game',
        'Trading Post',
        'Vendor',
        'World Event',
      ],
      types: [
        'Beast',
        'Mechanical',
        'Flying',
        'Dragonkin',
        'Aquatic',
        'Critter',
        'Humanoid',
        'Magic',
        'Elemental',
        'Undead',
      ],
    },
  },
} as const;
