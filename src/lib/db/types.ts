// Replace this stub with `supabase gen types typescript --project-id <id> > src/lib/db/types.ts`
// once a Supabase project exists. Until then the Supabase client falls back to `any`.

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
          project_id: string;
          user_id: string;
          contractor_id: string;
          rating: number;
          title: string | null;
          body: string | null;
          photos: string[];
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
