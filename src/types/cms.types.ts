export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type CmsDB = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<CmsDB, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  cms: {
    Tables: {
      announcements: {
        Row: {
          createdat: string | null
          description: string | null
          id: string
          image: Json | null
          isvisible: boolean | null
          mediatype: CmsDB["cms"]["Enums"]["mediatypes"]
          title: string | null
          updatedat: string | null
          videourl: string | null
        }
        Insert: {
          createdat?: string | null
          description?: string | null
          id?: string
          image?: Json | null
          isvisible?: boolean | null
          mediatype?: CmsDB["cms"]["Enums"]["mediatypes"]
          title?: string | null
          updatedat?: string | null
          videourl?: string | null
        }
        Update: {
          createdat?: string | null
          description?: string | null
          id?: string
          image?: Json | null
          isvisible?: boolean | null
          mediatype?: CmsDB["cms"]["Enums"]["mediatypes"]
          title?: string | null
          updatedat?: string | null
          videourl?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          createdat: string | null
          id: string
          name: string
          pageid: string
          updatedat: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          content: string
          createdat?: string | null
          id?: string
          name?: string
          pageid: string
          updatedat?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          content?: string
          createdat?: string | null
          id?: string
          name?: string
          pageid?: string
          updatedat?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      halloffame: {
        Row: {
          avatar: Json | null
          champion: string
          createdat: string | null
          finalsvideourl: string | null
          id: string
          petavatar: Json | null
          petname: string | null
          region: CmsDB["cms"]["Enums"]["regions"]
          runnerup: string
          season: string
          updatedat: string | null
        }
        Insert: {
          avatar?: Json | null
          champion: string
          createdat?: string | null
          finalsvideourl?: string | null
          id?: string
          petavatar?: Json | null
          petname?: string | null
          region: CmsDB["cms"]["Enums"]["regions"]
          runnerup: string
          season: string
          updatedat?: string | null
        }
        Update: {
          avatar?: Json | null
          champion?: string
          createdat?: string | null
          finalsvideourl?: string | null
          id?: string
          petavatar?: Json | null
          petname?: string | null
          region?: CmsDB["cms"]["Enums"]["regions"]
          runnerup?: string
          season?: string
          updatedat?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          author: string | null
          bannerimage: Json | null
          createdat: string | null
          id: string
          ispublished: boolean | null
          sections: Json[] | null
          slug: string
          title: string
          type: CmsDB["cms"]["Enums"]["pagetypes"]
          updatedat: string | null
        }
        Insert: {
          author?: string | null
          bannerimage?: Json | null
          createdat?: string | null
          id?: string
          ispublished?: boolean | null
          sections?: Json[] | null
          slug: string
          title: string
          type: CmsDB["cms"]["Enums"]["pagetypes"]
          updatedat?: string | null
        }
        Update: {
          author?: string | null
          bannerimage?: Json | null
          createdat?: string | null
          id?: string
          ispublished?: boolean | null
          sections?: Json[] | null
          slug?: string
          title?: string
          type?: CmsDB["cms"]["Enums"]["pagetypes"]
          updatedat?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          createdat: string | null
          id: string
          image: Json
          link: string
          partner: string
          updatedat: string | null
        }
        Insert: {
          createdat?: string | null
          id?: string
          image: Json
          link: string
          partner: string
          updatedat?: string | null
        }
        Update: {
          createdat?: string | null
          id?: string
          image?: Json
          link?: string
          partner?: string
          updatedat?: string | null
        }
        Relationships: []
      }
      prizes: {
        Row: {
          createdat: string | null
          description: string | null
          id: string
          imageposition: string | null
          images: Json[] | null
          index: number
          iscarousel: boolean | null
          iscolumnlayout: boolean | null
          textalignment: CmsDB["cms"]["Enums"]["alignments"]
          title: string
          updatedat: string | null
          videourl: string | null
        }
        Insert: {
          createdat?: string | null
          description?: string | null
          id?: string
          imageposition?: string | null
          images?: Json[] | null
          index: number
          iscarousel?: boolean | null
          iscolumnlayout?: boolean | null
          textalignment?: CmsDB["cms"]["Enums"]["alignments"]
          title: string
          updatedat?: string | null
          videourl?: string | null
        }
        Update: {
          createdat?: string | null
          description?: string | null
          id?: string
          imageposition?: string | null
          images?: Json[] | null
          index?: number
          iscarousel?: boolean | null
          iscolumnlayout?: boolean | null
          textalignment?: CmsDB["cms"]["Enums"]["alignments"]
          title?: string
          updatedat?: string | null
          videourl?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          createdat: string | null
          id: string
          images: Json[] | null
          index: number
          title: string
          updatedat: string | null
        }
        Insert: {
          createdat?: string | null
          id?: string
          images?: Json[] | null
          index: number
          title: string
          updatedat?: string | null
        }
        Update: {
          createdat?: string | null
          id?: string
          images?: Json[] | null
          index?: number
          title?: string
          updatedat?: string | null
        }
        Relationships: []
      }
      rules: {
        Row: {
          content: string
          createdat: string | null
          id: string
          images: Json[] | null
          index: number
          title: string
          updatedat: string | null
        }
        Insert: {
          content: string
          createdat?: string | null
          id?: string
          images?: Json[] | null
          index: number
          title: string
          updatedat?: string | null
        }
        Update: {
          content?: string
          createdat?: string | null
          id?: string
          images?: Json[] | null
          index?: number
          title?: string
          updatedat?: string | null
        }
        Relationships: []
      }
      schedules: {
        Row: {
          createdat: string | null
          description: string | null
          id: string
          images: Json[] | null
          isvisible: boolean | null
          layout: CmsDB["cms"]["Enums"]["layouts"]
          title: string | null
          updatedat: string | null
        }
        Insert: {
          createdat?: string | null
          description?: string | null
          id?: string
          images?: Json[] | null
          isvisible?: boolean | null
          layout?: CmsDB["cms"]["Enums"]["layouts"]
          title?: string | null
          updatedat?: string | null
        }
        Update: {
          createdat?: string | null
          description?: string | null
          id?: string
          images?: Json[] | null
          isvisible?: boolean | null
          layout?: CmsDB["cms"]["Enums"]["layouts"]
          title?: string | null
          updatedat?: string | null
        }
        Relationships: []
      }
      signups: {
        Row: {
          createdat: string | null
          id: string
          images: Json[] | null
          isvisible: boolean | null
          layout: CmsDB["cms"]["Enums"]["layouts"]
          title: string | null
          updatedat: string | null
        }
        Insert: {
          createdat?: string | null
          id?: string
          images?: Json[] | null
          isvisible?: boolean | null
          layout?: CmsDB["cms"]["Enums"]["layouts"]
          title?: string | null
          updatedat?: string | null
        }
        Update: {
          createdat?: string | null
          id?: string
          images?: Json[] | null
          isvisible?: boolean | null
          layout?: CmsDB["cms"]["Enums"]["layouts"]
          title?: string | null
          updatedat?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: { Args: { user_id: string }; Returns: string }
      has_role: { Args: { required_role: string }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      is_author: { Args: never; Returns: boolean }
    }
    Enums: {
      alignments: "left" | "center" | "right"
      layouts: "2" | "3" | "4"
      mediatypes: "image" | "video" | "none"
      pagetypes: "articles" | "guides" | "pet-reviews"
      regions: "na" | "eu" | "oce" | "cn"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<CmsDB, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof CmsDB, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  cms: {
    Enums: {
      alignments: ["left", "center", "right"],
      layouts: ["2", "3", "4"],
      mediatypes: ["image", "video", "none"],
      pagetypes: ["articles", "guides", "pet-reviews"],
      regions: ["na", "eu", "oce", "cn"],
    },
  },
} as const
