export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ApiDB = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<ApiDB, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  api: {
    Tables: {
      battle_logs_075e7708cfa44b30a0334246520f605a: {
        Row: {
          battle: Json;
          created_at: string | null;
          duration: string;
          id: string;
          match_id: string;
          opponent_team: string[];
          player_team: string[];
          result: string;
          rounds: number;
          timestamp: string;
        };
        Insert: {
          battle: Json;
          created_at?: string | null;
          duration: string;
          id?: string;
          match_id: string;
          opponent_team: string[];
          player_team: string[];
          result: string;
          rounds: number;
          timestamp: string;
        };
        Update: {
          battle?: Json;
          created_at?: string | null;
          duration?: string;
          id?: string;
          match_id?: string;
          opponent_team?: string[];
          player_team?: string[];
          result?: string;
          rounds?: number;
          timestamp?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'battle_logs_075e7708cfa44b30a0334246520f605a_match_id_fkey';
            columns: ['match_id'];
            isOneToOne: false;
            referencedRelation: 'matches_075e7708cfa44b30a0334246520f605a';
            referencedColumns: ['id'];
          },
        ];
      };
      battle_logs_404a0d14097348b18fd645ba9adb4fb9: {
        Row: {
          battle: Json;
          created_at: string | null;
          duration: string;
          id: string;
          match_id: string;
          opponent_team: string[];
          player_team: string[];
          result: string;
          rounds: number;
          timestamp: string;
        };
        Insert: {
          battle: Json;
          created_at?: string | null;
          duration: string;
          id?: string;
          match_id: string;
          opponent_team: string[];
          player_team: string[];
          result: string;
          rounds: number;
          timestamp: string;
        };
        Update: {
          battle?: Json;
          created_at?: string | null;
          duration?: string;
          id?: string;
          match_id?: string;
          opponent_team?: string[];
          player_team?: string[];
          result?: string;
          rounds?: number;
          timestamp?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'battle_logs_404a0d14097348b18fd645ba9adb4fb9_match_id_fkey';
            columns: ['match_id'];
            isOneToOne: false;
            referencedRelation: 'matches_404a0d14097348b18fd645ba9adb4fb9';
            referencedColumns: ['id'];
          },
        ];
      };
      matches_075e7708cfa44b30a0334246520f605a: {
        Row: {
          created_at: string | null;
          date: string;
          id: string;
          is_forfeit: boolean | null;
          opponent_score: number | null;
          outcome: string | null;
          owner: string;
          owner_score: number | null;
          player1: string;
          player2: string;
          region: string;
        };
        Insert: {
          created_at?: string | null;
          date: string;
          id?: string;
          is_forfeit?: boolean | null;
          opponent_score?: number | null;
          outcome?: string | null;
          owner: string;
          owner_score?: number | null;
          player1: string;
          player2: string;
          region: string;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          id?: string;
          is_forfeit?: boolean | null;
          opponent_score?: number | null;
          outcome?: string | null;
          owner?: string;
          owner_score?: number | null;
          player1?: string;
          player2?: string;
          region?: string;
        };
        Relationships: [];
      };
      matches_404a0d14097348b18fd645ba9adb4fb9: {
        Row: {
          created_at: string | null;
          date: string;
          id: string;
          is_forfeit: boolean | null;
          opponent_score: number | null;
          outcome: string | null;
          owner: string;
          owner_score: number | null;
          player1: string;
          player2: string;
          region: string;
        };
        Insert: {
          created_at?: string | null;
          date: string;
          id?: string;
          is_forfeit?: boolean | null;
          opponent_score?: number | null;
          outcome?: string | null;
          owner: string;
          owner_score?: number | null;
          player1: string;
          player2: string;
          region: string;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          id?: string;
          is_forfeit?: boolean | null;
          opponent_score?: number | null;
          outcome?: string | null;
          owner?: string;
          owner_score?: number | null;
          player1?: string;
          player2?: string;
          region?: string;
        };
        Relationships: [];
      };
      pet_usage_075e7708cfa44b30a0334246520f605a: {
        Row: {
          created_at: string | null;
          id: string;
          match_id: string;
          pet_data: Json;
          total_played: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          match_id: string;
          pet_data: Json;
          total_played: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          match_id?: string;
          pet_data?: Json;
          total_played?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'pet_usage_075e7708cfa44b30a0334246520f605a_match_id_fkey';
            columns: ['match_id'];
            isOneToOne: false;
            referencedRelation: 'matches_075e7708cfa44b30a0334246520f605a';
            referencedColumns: ['id'];
          },
        ];
      };
      pet_usage_404a0d14097348b18fd645ba9adb4fb9: {
        Row: {
          created_at: string | null;
          id: string;
          match_id: string;
          pet_data: Json;
          total_played: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          match_id: string;
          pet_data: Json;
          total_played: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          match_id?: string;
          pet_data?: Json;
          total_played?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'pet_usage_404a0d14097348b18fd645ba9adb4fb9_match_id_fkey';
            columns: ['match_id'];
            isOneToOne: false;
            referencedRelation: 'matches_404a0d14097348b18fd645ba9adb4fb9';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          discord_id: string | null;
          email: string;
          id: string;
          role: string | null;
          updated_at: string | null;
          username: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          discord_id?: string | null;
          email: string;
          id: string;
          role?: string | null;
          updated_at?: string | null;
          username: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          discord_id?: string | null;
          email?: string;
          id?: string;
          role?: string | null;
          updated_at?: string | null;
          username?: string;
        };
        Relationships: [];
      };
      tournament_pet_stats_075e7708cfa44b30a0334246520f605a: {
        Row: {
          created_at: string | null;
          id: string;
          pet_data: Json;
          total_played: number;
          tournament_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          pet_data: Json;
          total_played?: number;
          tournament_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          pet_data?: Json;
          total_played?: number;
          tournament_id?: string;
        };
        Relationships: [];
      };
      tournament_pet_stats_404a0d14097348b18fd645ba9adb4fb9: {
        Row: {
          created_at: string | null;
          id: string;
          pet_data: Json;
          total_played: number;
          tournament_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          pet_data: Json;
          total_played?: number;
          tournament_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          pet_data?: Json;
          total_played?: number;
          tournament_id?: string;
        };
        Relationships: [];
      };
      tournaments: {
        Row: {
          created_at: string | null;
          end_date: string | null;
          id: string;
          name: string;
          participant_count: number;
          start_date: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          end_date?: string | null;
          id?: string;
          name: string;
          participant_count?: number;
          start_date: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          end_date?: string | null;
          id?: string;
          name?: string;
          participant_count?: number;
          start_date?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      manage_tournament_tables: {
        Args: { action: string; tournament_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<ApiDB, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof ApiDB, 'public'>];

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
  api: {
    Enums: {},
  },
} as const;
