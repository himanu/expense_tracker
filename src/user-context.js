import { createContext, useState, useEffect } from "react";
import { auth } from "./firebase.config";

export const UserContext = createContext();

export const UserContextProvider = ({children}) => {
    const [user, setUser] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unregister = auth.onAuthStateChanged((user) => {
            setUser(user ?? "");
            setIsLoading(false);
        });
        return () => unregister();
    }, []);

    const signOutUser = () => {
        setIsLoading(true);
        auth.signOut();
    }
    return (
        <UserContext.Provider
            value={{
                user,
                isLoading,
                signOutUser
            }}
        >
            {children}
        </UserContext.Provider>
    )
}