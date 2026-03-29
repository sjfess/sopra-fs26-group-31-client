"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Spin } from "antd";
import GameHub from "./components/GameHub";

const Profile: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const { value: token, clear: clearToken } = useLocalStorage<string>("token", "");
  const { value: userId, clear: clearUserId } = useLocalStorage<string>("userId", "");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await apiService.get<User>(`/users/${userId}`);
        setUser(response);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [token, userId]);

  const handleLogout = async () => {
    try {
      await apiService.post("/auth/logout", {});
    } catch {
      // proceed with logout even if request fails
    }
    clearToken();
    clearUserId();
    router.push("/login");
  };

  if (!user) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#0f2557" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", backgroundColor: "#0f2557", minHeight: "100vh" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <span style={{ color: "#e3cb2c", fontSize: "1.4rem", fontFamily: "Georgia, serif", fontWeight: "bold" }}>
          Historical Reconstruction
        </span>
        <Button
          onClick={handleLogout}
          style={{
            borderRadius: "999px",
            borderColor: "#e3cb2c",
            color: "white",
            backgroundColor: "transparent",
            fontWeight: "bold",
          }}
        >
          Log Out
        </Button>
      </nav>

      <div style={{ backgroundColor: "#0d1b4b", border: "1px solid #e3cb2c", borderRadius: "16px", padding: "32px", marginBottom: "32px" }}>
        <h2 style={{ color: "#e3cb2c", fontFamily: "Georgia, serif", marginBottom: "16px" }}>Profile</h2>
        <p style={{ color: "#cdd8f0", margin: "4px 0" }}><strong>Username:</strong> {user.username}</p>
        {user.name && <p style={{ color: "#cdd8f0", margin: "4px 0" }}><strong>Name:</strong> {user.name}</p>}
        <p style={{ color: "#cdd8f0", margin: "4px 0" }}><strong>Status:</strong> {user.status}</p>
      </div>

      <GameHub />
    </div>
  );
};

export default Profile;
