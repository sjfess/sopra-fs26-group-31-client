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
    { key: "profile",      label: "Profile",      href: "/profile"      },
    { key: "leaderboard",  label: "Leaderboard",  href: "/leaderboard"  },
    { key: "tutorial",     label: "Tutorial",     href: "/tutorial"     },
    { key: "about",        label: "About",        href: "/about"        },
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

    const isActive = (href: string) =>
        href === "/profile" ? pathname.startsWith("/profile") : pathname === href;

    if (variant === "minimal") {
        return (
            <nav className="navbar">
                <span className="navbar-brand">Historical Reconstruction</span>

                {actionButton ? (
                    <Button onClick={actionButton.onClick} className="navbar-action-btn">
                        {actionButton.label}
                    </Button>
                ) : minimalLinks && minimalLinks.length > 0 ? (
                    <div className="navbar-links">
                        {minimalLinks.map((link) => (
                            <span
                                key={link.href}
                                onClick={() => router.push(link.href)}
                                className="navbar-link"
                            >
                                {link.label}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span
                        onClick={() => (onBack ? onBack() : router.push(backHref))}
                        className="navbar-link"
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
        <nav className="navbar">
            <span className="navbar-brand">Historical Reconstruction</span>

            <div className="navbar-links">
                {DEFAULT_LINKS.map((link) => (
                    <span
                        key={link.key}
                        onClick={() => handleLinkClick(link)}
                        className={isActive(link.href) ? "navbar-link-active" : "navbar-link"}
                    >
                        {link.label}
                    </span>
                ))}
            </div>

            {onLogout ? (
                <Button onClick={onLogout} className="navbar-action-btn">
                    Log Out
                </Button>
            ) : (
                <span className="navbar-spacer" aria-hidden="true" />
            )}
        </nav>
    );
};

export default AppNavbar;
