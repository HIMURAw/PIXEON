"use client";

import React, { createContext, useContext, useState } from "react";

type SupportContextType = {
    isOpen: boolean;
    openSupport: () => void;
    closeSupport: () => void;
    toggleSupport: () => void;
};

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export function SupportProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openSupport = () => setIsOpen(true);
    const closeSupport = () => setIsOpen(false);
    const toggleSupport = () => setIsOpen((prev) => !prev);

    return (
        <SupportContext.Provider value={{ isOpen, openSupport, closeSupport, toggleSupport }}>
            {children}
        </SupportContext.Provider>
    );
}

export function useSupport() {
    const context = useContext(SupportContext);
    if (context === undefined) {
        throw new Error("useSupport must be used within a SupportProvider");
    }
    return context;
}
