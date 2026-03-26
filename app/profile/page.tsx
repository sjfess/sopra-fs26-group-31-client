"use client";

import React from "react";
import GameHub from "./components/GameHub";

const Profile: React.FC = () => {
  return (
      <div style={{ padding: "40px", backgroundColor: "#0f2557", minHeight: "100vh" }}>
        <GameHub />
      </div>
  );
};

export default Profile;