import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext();
export default function AuthProvider({ children }) {
  const [token, settoken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken) settoken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
    setisLoading(false);
  }, []);
  return (
    < AuthContext.Provider value={{token,settoken,setUser,user,isLoading}}>
      {children}
    </ AuthContext.Provider>
  )
}
