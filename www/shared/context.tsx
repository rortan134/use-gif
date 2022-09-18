import React, {
    useState,
    useEffect,
    useMemo,
    useContext,
    createContext,
    ReactNode,
    Dispatch,
} from "react";

import { IActivePen } from "../types";

interface IStateValues {
    urls: string[];
    setUrls: Dispatch<React.SetStateAction<string[]>>;
    activePen: IActivePen | undefined;
    setActivePen: Dispatch<React.SetStateAction<IActivePen | undefined>>;
}

export const AppContext = createContext({} as IStateValues);

export const AppContextProvider = ({
    children,
}: {
    children: ReactNode | ReactNode[];
}) => {
    const [urls, setUrls] = useState<string[]>([]);
    const [activePen, setActivePen] = useState<IActivePen | undefined>(
        undefined
    );

    const values = useMemo(
        () => ({
            urls,
            setUrls,
            activePen,
            setActivePen,
        }),
        [urls, activePen]
    );

    return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

//
export function useAppContext() {
    const context = useContext(AppContext);

    if (!context) {
        console.error("Error deploying App Context");
    }

    return context;
}

export default useAppContext;
