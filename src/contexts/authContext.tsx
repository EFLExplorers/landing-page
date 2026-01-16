import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../utils/supabaseClient";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  userRole: "student" | "teacher" | null;
  lastActivity: Date | null;
  timeUntilExpiry: number | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<"student" | "teacher" | null>(null);
  const [lastActivity, setLastActivity] = useState<Date | null>(null);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number | null>(null);

  // Session timeout: 2 hours (7200000 ms)
  const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  const WARNING_TIME = 5 * 60 * 1000; // 5 minutes warning

  // Update last activity timestamp
  const updateActivity = () => {
    setLastActivity(new Date());
  };

  // Activity event listeners
  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = () => updateActivity();

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initial activity timestamp
    if (user) {
      updateActivity();
    }

    return () => {
      // Cleanup event listeners
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [user]);

  // Session timeout logic
  useEffect(() => {
    if (!user || !lastActivity) return;

    const checkTimeout = () => {
      const now = new Date();
      const timeSinceActivity = now.getTime() - lastActivity.getTime();
      const timeLeft = SESSION_TIMEOUT - timeSinceActivity;

      setTimeUntilExpiry(timeLeft);

      if (timeSinceActivity >= SESSION_TIMEOUT) {
        // Session expired
        signOut();
      }
    };

    // Check every minute
    const interval = setInterval(checkTimeout, 60000);
    checkTimeout(); // Check immediately

    return () => clearInterval(interval);
  }, [user, lastActivity]);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch user role from database
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();

        setUserRole(userData?.role ?? null);
        setLastActivity(new Date()); // Set initial activity
      }

      setLoading(false);
    };

    checkSession();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();

        setUserRole(userData?.role ?? null);
      } else {
        setUserRole(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
    setLastActivity(null);
    setTimeUntilExpiry(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut,
        userRole,
        lastActivity,
        timeUntilExpiry,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
