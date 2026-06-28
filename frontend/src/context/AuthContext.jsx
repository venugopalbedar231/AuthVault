import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(() => {
        const token = localStorage.getItem("accessToken");
        console.log("AuthContext init token:", token);  // add this
        return token || null;
    });

    const login = (token) => {
        localStorage.setItem("accessToken", token);
        setAccessToken(token);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setAccessToken(null);
    };

    return (
        <AuthContext.Provider value={{ accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);