// Tipuri generate manual pentru schema din supabase/migrations/0001_init.sql.
// Regenerează cu `supabase gen types typescript` după ce migrațiile rulează pe proiectul live.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          city: string | null;
          country: string | null;
          status: "active" | "pending" | "archived";
          logo_url: string | null;
          mentor_org_id: string | null;
          curriculum_name: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["organizations"]["Row"]> & {
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["organizations"]["Row"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          is_platform_admin: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      memberships: {
        Row: {
          id: string;
          org_id: string;
          user_id: string;
          role: "org_admin" | "leader" | "volunteer";
          department: string | null;
          status: "active" | "suspended";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["memberships"]["Row"]> & {
          org_id: string;
          user_id: string;
          role: "org_admin" | "leader" | "volunteer";
        };
        Update: Partial<Database["public"]["Tables"]["memberships"]["Row"]>;
        Relationships: [];
      };
      invites: {
        Row: {
          id: string;
          org_id: string;
          code: string;
          role: "org_admin" | "leader" | "volunteer";
          department: string | null;
          email: string | null;
          created_by: string | null;
          expires_at: string;
          used_at: string | null;
          used_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["invites"]["Row"]> & {
          org_id: string;
          role: "org_admin" | "leader" | "volunteer";
        };
        Update: Partial<Database["public"]["Tables"]["invites"]["Row"]>;
        Relationships: [];
      };
      org_chart_nodes: {
        Row: {
          id: string;
          org_id: string;
          parent_id: string | null;
          title: string;
          membership_id: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["org_chart_nodes"]["Row"]> & {
          org_id: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["org_chart_nodes"]["Row"]>;
        Relationships: [];
      };
      procedures: {
        Row: {
          id: string;
          org_id: string | null;
          category: string;
          title: string;
          body: string;
          version: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["procedures"]["Row"]> & {
          category: string;
          title: string;
          body: string;
        };
        Update: Partial<Database["public"]["Tables"]["procedures"]["Row"]>;
        Relationships: [];
      };
      procedure_confirmations: {
        Row: {
          id: string;
          procedure_id: string;
          user_id: string;
          version_confirmed: number;
          confirmed_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["procedure_confirmations"]["Row"]> & {
          procedure_id: string;
          user_id: string;
          version_confirmed: number;
        };
        Update: Partial<Database["public"]["Tables"]["procedure_confirmations"]["Row"]>;
        Relationships: [];
      };
      resources: {
        Row: {
          id: string;
          org_id: string | null;
          category: string;
          title: string;
          description: string | null;
          file_url: string | null;
          age_group: string | null;
          tags: string[];
          status: "pending" | "approved" | "rejected";
          submitted_by: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["resources"]["Row"]> & {
          category: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["resources"]["Row"]>;
        Relationships: [];
      };
      curriculum_lessons: {
        Row: {
          id: string;
          org_id: string | null;
          age_group: string;
          week_start_date: string;
          title: string;
          description: string | null;
          materials_url: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["curriculum_lessons"]["Row"]> & {
          age_group: string;
          week_start_date: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["curriculum_lessons"]["Row"]>;
        Relationships: [];
      };
      book_recommendations: {
        Row: {
          id: string;
          org_id: string | null;
          title: string;
          author: string | null;
          description: string | null;
          cover_url: string | null;
          link_url: string | null;
          category: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["book_recommendations"]["Row"]> & {
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["book_recommendations"]["Row"]>;
        Relationships: [];
      };
      sim_sessions: {
        Row: {
          id: string;
          org_id: string;
          service_date: string;
          theme: string | null;
          notes: string | null;
          status: "planned" | "done" | "cancelled";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["sim_sessions"]["Row"]> & {
          org_id: string;
          service_date: string;
        };
        Update: Partial<Database["public"]["Tables"]["sim_sessions"]["Row"]>;
        Relationships: [];
      };
      sim_slots: {
        Row: {
          id: string;
          sim_session_id: string;
          department: string;
          age_group: string | null;
          lesson_id: string | null;
          assigned_membership_id: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["sim_slots"]["Row"]> & {
          sim_session_id: string;
          department: string;
        };
        Update: Partial<Database["public"]["Tables"]["sim_slots"]["Row"]>;
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          org_id: string;
          title: string;
          description: string | null;
          location: string | null;
          start_at: string;
          end_at: string | null;
          cover_url: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["events"]["Row"]> & {
          org_id: string;
          title: string;
          start_at: string;
        };
        Update: Partial<Database["public"]["Tables"]["events"]["Row"]>;
        Relationships: [];
      };
      event_rsvps: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          status: "going" | "maybe" | "not_going";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["event_rsvps"]["Row"]> & {
          event_id: string;
          user_id: string;
          status: "going" | "maybe" | "not_going";
        };
        Update: Partial<Database["public"]["Tables"]["event_rsvps"]["Row"]>;
        Relationships: [];
      };
      prayer_requests: {
        Row: {
          id: string;
          org_id: string;
          user_id: string | null;
          content: string;
          is_anonymous: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["prayer_requests"]["Row"]> & {
          org_id: string;
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["prayer_requests"]["Row"]>;
        Relationships: [];
      };
      prayer_prayed_for: {
        Row: {
          id: string;
          prayer_request_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["prayer_prayed_for"]["Row"]> & {
          prayer_request_id: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["prayer_prayed_for"]["Row"]>;
        Relationships: [];
      };
      feedback_items: {
        Row: {
          id: string;
          org_id: string;
          user_id: string | null;
          category: string | null;
          message: string;
          status: "new" | "reviewed" | "resolved";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["feedback_items"]["Row"]> & {
          org_id: string;
          message: string;
        };
        Update: Partial<Database["public"]["Tables"]["feedback_items"]["Row"]>;
        Relationships: [];
      };
      involvement_applications: {
        Row: {
          id: string;
          org_id: string;
          user_id: string;
          desired_role: string;
          message: string | null;
          status: "pending" | "approved" | "rejected";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["involvement_applications"]["Row"]> & {
          org_id: string;
          user_id: string;
          desired_role: string;
        };
        Update: Partial<Database["public"]["Tables"]["involvement_applications"]["Row"]>;
        Relationships: [];
      };
      induction_steps: {
        Row: {
          id: string;
          org_id: string | null;
          title: string;
          body: string;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["induction_steps"]["Row"]> & {
          title: string;
          body: string;
        };
        Update: Partial<Database["public"]["Tables"]["induction_steps"]["Row"]>;
        Relationships: [];
      };
      induction_progress: {
        Row: {
          id: string;
          step_id: string;
          user_id: string;
          completed_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["induction_progress"]["Row"]> & {
          step_id: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["induction_progress"]["Row"]>;
        Relationships: [];
      };
      org_age_groups: {
        Row: {
          id: string;
          org_id: string;
          label: string;
          min_age: number | null;
          max_age: number | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["org_age_groups"]["Row"]> & {
          org_id: string;
          label: string;
        };
        Update: Partial<Database["public"]["Tables"]["org_age_groups"]["Row"]>;
        Relationships: [];
      };
      org_readiness_checks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["org_readiness_checks"]["Row"]> & {
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["org_readiness_checks"]["Row"]>;
        Relationships: [];
      };
      org_readiness_status: {
        Row: {
          id: string;
          org_id: string;
          check_id: string;
          is_complete: boolean;
          completed_by: string | null;
          completed_at: string | null;
          note: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["org_readiness_status"]["Row"]> & {
          org_id: string;
          check_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["org_readiness_status"]["Row"]>;
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          url: string | null;
          category: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["courses"]["Row"]> & {
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["courses"]["Row"]>;
        Relationships: [];
      };
      coordinator_hub_posts: {
        Row: {
          id: string;
          title: string;
          body: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["coordinator_hub_posts"]["Row"]> & {
          title: string;
          body: string;
        };
        Update: Partial<Database["public"]["Tables"]["coordinator_hub_posts"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
