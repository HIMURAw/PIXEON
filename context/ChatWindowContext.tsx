"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChatWindowType = "live" | "ticket";

export interface LiveSession {
    sessionId: string;
    senderName: string;
    lastMessage: string;
    createdAt: string;
    unreadCount: number;
}

export interface Ticket {
    id: string;
    subject: string;
    category: string;
    priority: string;
    status: string;
    userName: string;
    createdAt: string;
}

export interface ChatWindow {
    /** Unique window id: sessionId or ticketId */
    id: string;
    type: ChatWindowType;
    /** Display title */
    title: string;
    subtitle?: string;
    /** Current position on screen */
    position: { x: number; y: number };
    /** Current size */
    size: { width: number; height: number };
    /** z-index order */
    zIndex: number;
    /** Whether window is minimized */
    minimized: boolean;
    /** Raw data payload */
    data: LiveSession | Ticket;
}

// ─── Context Shape ────────────────────────────────────────────────────────────

interface ChatWindowContextType {
    windows: ChatWindow[];
    openWindow: (
        id: string,
        type: ChatWindowType,
        title: string,
        subtitle: string | undefined,
        data: LiveSession | Ticket,
        dropPosition?: { x: number; y: number }
    ) => void;
    closeWindow: (id: string) => void;
    focusWindow: (id: string) => void;
    updatePosition: (id: string, position: { x: number; y: number }) => void;
    updateSize: (id: string, size: { width: number; height: number }) => void;
    toggleMinimize: (id: string) => void;
    topZIndex: number;
}

const ChatWindowContext = createContext<ChatWindowContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

const BASE_Z = 1000;
const CASCADE_OFFSET = 40;

export function ChatWindowProvider({ children }: { children: React.ReactNode }) {
    const [windows, setWindows] = useState<ChatWindow[]>([]);
    const zCounter = useRef(BASE_Z);

    const bumpZ = useCallback(() => {
        zCounter.current += 1;
        return zCounter.current;
    }, []);

    /** Open or focus-bring-to-front an existing window */
    const openWindow = useCallback(
        (
            id: string,
            type: ChatWindowType,
            title: string,
            subtitle: string | undefined,
            data: LiveSession | Ticket,
            dropPosition?: { x: number; y: number }
        ) => {
            setWindows((prev) => {
                const existing = prev.find((w) => w.id === id);
                if (existing) {
                    // Focus: bring to top, un-minimize
                    const newZ = bumpZ();
                    return prev.map((w) =>
                        w.id === id
                            ? { ...w, zIndex: newZ, minimized: false }
                            : w
                    );
                }

                // Calculate cascaded default position
                const offset = prev.length * CASCADE_OFFSET;
                const defaultPos = dropPosition ?? {
                    x: Math.min(120 + offset, window.innerWidth - 420),
                    y: Math.min(80 + offset, window.innerHeight - 560),
                };

                const newZ = bumpZ();
                const newWindow: ChatWindow = {
                    id,
                    type,
                    title,
                    subtitle,
                    position: defaultPos,
                    size: { width: 380, height: 500 }, // Default size
                    zIndex: newZ,
                    minimized: false,
                    data,
                };
                return [...prev, newWindow];
            });
        },
        [bumpZ]
    );

    const closeWindow = useCallback((id: string) => {
        setWindows((prev) => prev.filter((w) => w.id !== id));
    }, []);

    const focusWindow = useCallback(
        (id: string) => {
            const newZ = bumpZ();
            setWindows((prev) =>
                prev.map((w) => (w.id === id ? { ...w, zIndex: newZ } : w))
            );
        },
        [bumpZ]
    );

    const updatePosition = useCallback(
        (id: string, position: { x: number; y: number }) => {
            setWindows((prev) =>
                prev.map((w) => (w.id === id ? { ...w, position } : w))
            );
        },
        []
    );

    const updateSize = useCallback(
        (id: string, size: { width: number; height: number }) => {
            setWindows((prev) =>
                prev.map((w) => (w.id === id ? { ...w, size } : w))
            );
        },
        []
    );

    const toggleMinimize = useCallback((id: string) => {
        setWindows((prev) =>
            prev.map((w) =>
                w.id === id ? { ...w, minimized: !w.minimized } : w
            )
        );
    }, []);

    return (
        <ChatWindowContext.Provider
            value={{
                windows,
                openWindow,
                closeWindow,
                focusWindow,
                updatePosition,
                updateSize,
                toggleMinimize,
                topZIndex: zCounter.current,
            }}
        >
            {children}
        </ChatWindowContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useChatWindows() {
    const ctx = useContext(ChatWindowContext);
    if (!ctx) throw new Error("useChatWindows must be used inside ChatWindowProvider");
    return ctx;
}
