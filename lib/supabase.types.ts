export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type GenericTable = {
  Row: Record<string, any>;
  Insert: Record<string, any>;
  Update: Record<string, any>;
  Relationships: never[];
};

export type Database = {
  public: {
    Tables: {
      activity_logs: GenericTable;
      bookings: GenericTable;
      kyc_documents: GenericTable;
      payments: GenericTable;
      professionals: GenericTable;
      profiles: GenericTable;
      support_tickets: {
        Row: {
          id: string;
          user_email: string | null;
          message: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_email?: string | null;
          message?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_email?: string | null;
          message?: string | null;
          created_at?: string | null;
        };
        Relationships: never[];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
