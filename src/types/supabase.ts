// Hand-written types matching schema.sql.
// Once the project is live you can replace this with the auto-generated version:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
        };
        Relationships: [];
      };
      quiz_results: {
        Row: {
          id: string;
          user_id: string;
          score: number;
          pillar_scores: Json;
          dim_scores: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          score: number;
          pillar_scores: Json;
          dim_scores?: Json | null;
          created_at?: string;
        };
        Update: {
          score?: number;
          pillar_scores?: Json;
          dim_scores?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'quiz_results_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
