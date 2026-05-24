// Hand-written stub kept in sync with supabase/migrations/001..010. Run
// `npm run types:gen` to replace this file with authoritative types pulled
// from your Supabase project (requires `SUPABASE_PROJECT_ID` env).

export type UserRole = "customer" | "contractor" | "admin";
export type Locale = "en" | "ko";

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          nickname: string | null;
          phone: string | null;
          region_key: "seoul" | "gyeonggi" | "busan" | "incheon" | null;
          address: string | null;
          budget_min: number | null;
          budget_max: number | null;
          onboarded_at: string | null;
          role: UserRole;
          locale: Locale;
          contractor_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nickname?: string | null;
          phone?: string | null;
          region_key?: "seoul" | "gyeonggi" | "busan" | "incheon" | null;
          address?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
          onboarded_at?: string | null;
          role?: UserRole;
          locale?: Locale;
          contractor_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["user_profiles"]["Insert"]>;
      };
      contractors: {
        Row: {
          id: string;
          name: string;
          company: string;
          licensed: boolean;
          license_number: string | null;
          business_number: string | null;
          region: string;
          region_key: "seoul" | "gyeonggi" | "busan" | "incheon";
          years_experience: number;
          completed_projects: number;
          rating: number;
          review_count: number;
          response_hours: number;
          starting_price: number;
          badges: string[];
          bio: string | null;
          profile_image: string | null;
          cover: string | null;
          portfolio: string[];
          license_docs: string[];
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["contractors"]["Row"], "created_at" | "is_active"> & {
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contractors"]["Insert"]>;
      };
      design_plans: {
        Row: {
          id: string;
          user_id: string;
          style_key: string;
          style_label: string | null;
          selected_option_ids: string[];
          space_image_url: string | null;
          hero_proposal_url: string | null;
          proposal_urls: string[];
          user_reference_urls: string[];
          status: "pending" | "generating" | "done" | "failed";
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          style_key: string;
          style_label?: string | null;
          selected_option_ids?: string[];
          space_image_url?: string | null;
          hero_proposal_url?: string | null;
          proposal_urls?: string[];
          user_reference_urls?: string[];
          status?: "pending" | "generating" | "done" | "failed";
          error_message?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["design_plans"]["Insert"]>;
      };
      generated_images: {
        Row: {
          id: string;
          plan_id: string;
          space_index: number;
          before_url: string | null;
          after_url: string;
          prompt: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["generated_images"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["generated_images"]["Insert"]>;
      };
      quote_requests: {
        Row: {
          id: string;
          user_id: string;
          contractor_id: string;
          design_plan_id: string | null;
          message: string | null;
          budget_min: number | null;
          budget_max: number | null;
          preferred_start: string | null;
          attach_plan: boolean;
          status: "pending" | "accepted" | "rejected" | "quoted" | "cancelled";
          created_at: string;
          responded_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["quote_requests"]["Row"],
          "id" | "created_at" | "responded_at" | "status" | "attach_plan"
        > & {
          status?: "pending" | "accepted" | "rejected" | "quoted" | "cancelled";
          attach_plan?: boolean;
          responded_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["quote_requests"]["Insert"]>;
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          contractor_id: string;
          quote_request_id: string | null;
          title: string;
          status: "pending" | "in_progress" | "completed" | "cancelled";
          progress: number;
          current_stage:
            | "demolition"
            | "plumbing"
            | "electrical"
            | "carpentry"
            | "painting"
            | "finishing";
          start_date: string | null;
          expected_end: string | null;
          total_budget: number | null;
          spent_budget: number | null;
          address_detail: string | null;
          pm_name: string | null;
          pm_role: string | null;
          pm_avatar: string | null;
          pm_response_hours: number;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          user_id: string;
          contractor_id: string;
          quote_request_id?: string | null;
          title: string;
          status?: "pending" | "in_progress" | "completed" | "cancelled";
          progress?: number;
          current_stage?:
            | "demolition"
            | "plumbing"
            | "electrical"
            | "carpentry"
            | "painting"
            | "finishing";
          start_date?: string | null;
          expected_end?: string | null;
          total_budget?: number | null;
          spent_budget?: number | null;
          address_detail?: string | null;
          pm_name?: string | null;
          pm_role?: string | null;
          pm_avatar?: string | null;
          pm_response_hours?: number;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      project_updates: {
        Row: {
          id: string;
          project_id: string;
          stage: string | null;
          author: string | null;
          title: string | null;
          body: string | null;
          photos: string[];
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["project_updates"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["project_updates"]["Insert"]>;
      };
      chat_messages: {
        Row: {
          id: string;
          project_id: string;
          sender_type: "user" | "pm" | "ai" | "system";
          sender_id: string | null;
          body: string;
          attachments: string[];
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["chat_messages"]["Row"], "id" | "created_at" | "attachments"> & {
          attachments?: string[];
        };
        Update: Partial<Database["public"]["Tables"]["chat_messages"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          project_id: string | null;
          user_id: string | null;
          contractor_id: string;
          rating: number;
          title: string | null;
          body: string | null;
          photos: string[];
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["reviews"]["Row"],
          "id" | "created_at" | "display_name" | "avatar_url"
        > & {
          display_name?: string | null;
          avatar_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      material_catalog: {
        Row: {
          id: string;
          code: string;
          style_key: string;
          slot_key: "walls" | "floor" | "lighting" | "kitchen" | "finishing";
          category: string;
          name: string;
          brand: string | null;
          tier: "basic" | "standard" | "premium";
          unit: string;
          qty: number;
          unit_price: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["material_catalog"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["material_catalog"]["Insert"]>;
      };
      material_alternatives: {
        Row: {
          id: string;
          base_id: string;
          name: string;
          tier: "basic" | "standard" | "premium";
          unit_price: number;
        };
        Insert: Omit<
          Database["public"]["Tables"]["material_alternatives"]["Row"],
          "id"
        >;
        Update: Partial<
          Database["public"]["Tables"]["material_alternatives"]["Insert"]
        >;
      };
      design_plan_materials: {
        Row: {
          id: string;
          plan_id: string;
          material_id: string;
          variant_idx: number;
          qty: number;
          unit_price: number;
          tier: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["design_plan_materials"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["design_plan_materials"]["Insert"]
        >;
      };
      style_briefs: {
        Row: {
          style_key: string;
          label: string;
          intro: string;
          mood_images: string[];
          match_terms: string[];
        };
        Insert: Database["public"]["Tables"]["style_briefs"]["Row"];
        Update: Partial<Database["public"]["Tables"]["style_briefs"]["Insert"]>;
      };
      design_options: {
        Row: {
          id: string;
          category: "style" | "tone" | "flooring" | "wall" | "furniture";
          style_key: string;
          name: string;
          description: string | null;
          image: string | null;
          swatch: string | null;
          sort_order: number;
        };
        Insert: Database["public"]["Tables"]["design_options"]["Row"];
        Update: Partial<Database["public"]["Tables"]["design_options"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          kind:
            | "quote_received"
            | "project_update"
            | "pm_message"
            | "project_status"
            | "review_request";
          title: string;
          body: string | null;
          unread: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["notifications"]["Row"],
          "id" | "created_at" | "unread"
        > & {
          unread?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      ban_records: {
        Row: {
          id: string;
          contractor_id: string | null;
          reason:
            | "quote_fraud"
            | "abandonment"
            | "material_swap"
            | "false_license"
            | "abuse";
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["ban_records"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["ban_records"]["Insert"]>;
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
