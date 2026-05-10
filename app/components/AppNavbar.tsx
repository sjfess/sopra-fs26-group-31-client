"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "antd";

function readUserIdFromSession(): string | null {
    if (typeof window === "undefined") return null;
    const raw = window.sessionStorage.getItem("userId");
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (parsed === null || parsed === undefined || parsed === "") return null;
        return String(parsed);
    } catch {
        return raw;
    }
}

type NavLink = {
    key: string;
    label: string;
    href: string;
};

const DEFAULT_LINKS: NavLink[] = [
    { key: "profile", label: "Profile", href: "/profile" },
    { key: "leaderboard", label: "Leaderboard", href: "/leaderboard" },
    { key: "about", label: "About", href: "/about" },
];

interface AppNavbarProps {
    onLogout?: () => void;
    variant?: "default" | "minimal";
    backHref?: string;
    backLabel?: string;
    onBack?: () => void;
    profileHref?: string;
    minimalLinks?: { label: string; href: string }[];
    actionButton?: { label: string; onClick: () => void };
}

const ACTION_BUTTON_STYLE: React.CSSProperties = {
    borderRadius: "999px",
    backgroundColor: "#e3cb2c",
    borderColor: "#e3cb2c",
    color: "#0f2557",
    fontWeight: "bold",
};

const AppNavbar: React.FC<AppNavbarProps> = ({
    onLogout,
    variant = "default",
    backHref = "/",
    backLabel = "Back",
    onBack,
    profileHref,
    minimalLinks,
    actionButton,
}) => {
    const router = useRouter();
    const pathname = usePathname() ?? "";

    const [resolvedProfileHref, setResolvedProfileHref] = useState<string | null>(null);
    useEffect(() => {
        const userId = readUserIdFromSession();
        setResolvedProfileHref(userId ? `/profile/${userId}` : "/login");
    }, [pathname]);

    const navLinkStyle: React.CSSProperties = {
        color: "white",
        cursor: "pointer",
        fontSize: "0.95rem",
    };

    const activeLinkStyle: React.CSSProperties = {
        ...navLinkStyle,
        borderBottom: "2px solid #e3cb2c",
        paddingBottom: "2px",
    };

    const isActive = (href: string) =>
        href === "/profile" ? pathname.startsWith("/profile") : pathname === href;

    const navStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 32px",
        border: "1px solid #e3cb2c",
        margin: "12px",
        borderRadius: "4px",
        flexShrink: 0,
    };

    const titleStyle: React.CSSProperties = {
        color: "#e3cb2c",
        fontFamily: "Georgia, serif",
        fontWeight: "bold",
        fontSize: "1.1rem",
    };

    if (variant === "minimal") {
        return (
            <nav style={navStyle}>
                <span style={titleStyle}>Historical Reconstruction</span>
                {actionButton ? (
                    <Button onClick={actionButton.onClick} style={ACTION_BUTTON_STYLE}>
                        {actionButton.label}
                    </Button>
                ) : minimalLinks && minimalLinks.length > 0 ? (
                    <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
                        {minimalLinks.map((link) => (
                            <span
                                key={link.href}
                                onClick={() => router.push(link.href)}
                                style={navLinkStyle}
                            >
                                {link.label}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span
                        onClick={() => (onBack ? onBack() : router.push(backHref))}
                        style={navLinkStyle}
                    >
                        {backLabel}
                    </span>
                )}
            </nav>
        );
    }

    const handleLinkClick = (link: NavLink) => {
        if (link.key === "profile") {
            router.push(profileHref ?? resolvedProfileHref ?? "/login");
            return;
        }
        router.push(link.href);
    };

    return (
        <nav style={navStyle}>
            <span style={titleStyle}>Historical Reconstruction</span>

            <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
                {DEFAULT_LINKS.map((link) => (
                    <span
                        key={link.key}
                        onClick={() => handleLinkClick(link)}
                        style={isActive(link.href) ? activeLinkStyle : navLinkStyle}
                    >
                        {link.label}
                    </span>
                ))}
            </div>

            {onLogout ? (
                <Button onClick={onLogout} style={ACTION_BUTTON_STYLE}>
                    Log Out
                </Button>
            ) : (
                <span style={{ width: 100 }} aria-hidden="true" />
            )}
        </nav>
    );
};

export default AppNavbar;
