import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";

interface AuthContextType {
  token: string | null;
  user: string | null;
  role: string | null;
  login: (username: string, password: string) => Promise<void>;
   logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    console.log("Token updated:", token);
      console.log("User updated:", user);
  }, [token,user]);



  const logout = () => {
    setToken(null);
     setUser(null);
     setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };
  const login = async (username: string, password: string) => {
  try {
    const res = await axios.post("http://localhost:8000/login", {
      username,
      password,
    });
    setToken(res.data.token);
    setUser(res.data.user);
    setRole(res.data.role);
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        alert("User does not exist.");
      } else if (err.response?.status === 403) {
        alert("Incorrect password.");
      } else {
        alert("Unexpected error. Try again.");
      }
    } else {
      alert("Network or unknown error.");
    }
    console.error(err);
  }
};


  return <AuthContext.Provider value={{ token,user,role, login ,logout  }}>{children}</AuthContext.Provider>;
};
