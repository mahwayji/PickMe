import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  email: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simulate API call
    const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (storedUsers[email] && storedUsers[email] === password) {
      const user = { email, id: Date.now().toString() };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signUp = async (email: string, password: string) => {
    // Simulate API call
    const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (storedUsers[email]) {
      throw new Error('User already exists');
    }
    
    storedUsers[email] = password;
    localStorage.setItem('users', JSON.stringify(storedUsers));
    
    const user = { email, id: Date.now().toString() };
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const signInWithGoogle = async () => {
    // Simulate Google OAuth
    const user = { email: 'google.user@gmail.com', id: Date.now().toString() };
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
