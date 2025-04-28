
import { User, Session } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  username: string;
  role: 'admin' | 'hod' | 'staff';
  department?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
