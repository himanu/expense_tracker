import { createContext, useState } from "react";
import LoadingSvg from "./Loading";

export const LoaderContext = createContext();

export const LoaderContextProvider = ({children}) => {
    const [loader, toggleLoader] = useState(false);
    return (
        <LoaderContext.Provider value={{toggleLoader, loader}}>
            {children}
            {loader && (
                    <LoadingSvg />
            )}
        </LoaderContext.Provider>
    )
}