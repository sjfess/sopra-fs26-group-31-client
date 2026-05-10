"use client";

import { useEffect } from "react";
import { getApiDomain } from "@/utils/domain";

const HEARTBEAT_INTERVAL_MS = 5_000;

function readStoredToken(): string | null {
    const rawToken = window.sessionStorage.getItem("token");
    if (!rawToken) return null;

    try {
        const parsed = JSON.parse(rawToken);
        return parsed ? String(parsed) : null;
    } catch {
        return rawToken;
    }
}

export default function PresenceHeartbeat() {
    useEffect(() => {
        let isMounted = true;

        const sendHeartbeat = async () => {
            const token = readStoredToken();
            if (!token || !isMounted) return;

            try {
                await fetch(`${getApiDomain()}/auth/heartbeat`, {
                    method: "POST",
                    headers: {
                        Authorization: token,
                    },
                });
            } catch {
                // Presence is best-effort; the next heartbeat can retry.
            }
        };

        void sendHeartbeat();
        const intervalId = window.setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

        return () => {
            isMounted = false;
            window.clearInterval(intervalId);
        };
    }, []);

    return null;
}
