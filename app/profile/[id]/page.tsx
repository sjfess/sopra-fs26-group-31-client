"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Spin } from "antd";
import Navbar from "@/profile/[id]/components/Navbar";
import UserProfileCard from "@/profile/[id]/components/UserProfileCard";
import FriendsPanel from "@/profile/[id]/components/FriendsPanel";
import GameHub from "@/profile/[id]/components/GameHub";

const Profile: React.FC = () => {
    const router = useRouter();
    const { id } = useParams();
    const apiService = useApi();
    const { value: token, clear: clearToken } = useLocalStorage<string>("token", "");
    const { value: loggedInUserId, clear: clearUserId } = useLocalStorage<string>("userId", "");
    const [user, setUser] = useState<User | null>(null);
    const [isOwnProfile, setIsOwnProfile] = useState<boolean | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (!token) {
            router.push("/login");
            return;
        }
        const fetchUser = async () => {
            try {
                const response = await apiService.get<User>(`/users/${id}`);
                setUser(response);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };
        fetchUser();
    }, [mounted, token, id]);

    useEffect(() => {
        if (!loggedInUserId) return;
        setIsOwnProfile(String(loggedInUserId) === String(id));
    }, [loggedInUserId, id]);

    const handleLogout = async () => {
        try {
            await apiService.post("/auth/logout", {});
        } catch {
            // proceed anyway
        }
        clearToken();
        clearUserId();
        router.push("/login");
    };

    if (!mounted || !user || isOwnProfile === null) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#0f2557" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "#0f2557", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar onLogout={handleLogout} />
            <div style={{ display: "flex", gap: "24px", padding: "24px 32px", flex: 1 }}>
                <UserProfileCard user={user} isOwnProfile={isOwnProfile} />
                <FriendsPanel />
                {isOwnProfile && (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                        <GameHub />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;