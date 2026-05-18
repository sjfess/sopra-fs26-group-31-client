"use client";

import React, { useEffect, useState } from "react";
import { ConfigProvider, Modal } from "antd";

export const AVATAR_OPTIONS = [
    { seed: "Felix",  label: "Swifty"   },
    { seed: "Aneka",  label: "Gangster" },
    { seed: "Jasper", label: "Sicko"    },
    { seed: "Luna",   label: "Unsure"   },
    { seed: "Zara",   label: "Sadge"    },
    { seed: "Finn",   label: "Beginner" },
    { seed: "Maya",   label: "Anon"     },
    { seed: "Leo",    label: "Wannabe"  },
    { seed: "Nova",   label: "Playboy"  },
    { seed: "Ivy",    label: "Happy"    },
    { seed: "Rex",    label: "Swaggy"   },
    { seed: "Cleo",   label: "Pro"      },
].map(({ seed, label }) => ({
    label,
    url: `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${seed}`,
}));

interface AvatarPickerProps {
    open: boolean;
    currentAvatarUrl?: string | null;
    saving: boolean;
    onSave: (url: string) => void;
    onClose: () => void;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({ open, currentAvatarUrl, saving, onSave, onClose }) => {
    const [selected, setSelected] = useState<string>(currentAvatarUrl ?? "");

    useEffect(() => {
        if (open) setSelected(currentAvatarUrl ?? "");
    }, [open, currentAvatarUrl]);

    return (
        <ConfigProvider theme={{ token: { colorBgElevated: "#0d2a6e" } }}>
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            closable={false}
            className="avatar-picker-modal"
            styles={{
                mask: {
                    backdropFilter: "blur(3px)",
                    backgroundColor: "rgba(5,15,45,0.75)",
                },
            }}
            width={520}
        >
            {/* Header */}
            <div style={{
                padding: "20px 24px 0",
                borderBottom: "1px solid rgba(227,203,44,0.25)",
                marginBottom: 0,
            }}>
                <h2 className="panel-title" style={{ marginBottom: 16 }}>
                    Choose Your Avatar
                </h2>
            </div>

            {/* Avatar grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 10,
                padding: "20px 24px 16px",
            }}>
                {AVATAR_OPTIONS.map(({ label, url }) => {
                    const isSelected = selected === url;
                    return (
                        <button
                            key={url}
                            onClick={() => !saving && setSelected(url)}
                            aria-label={label}
                            aria-pressed={isSelected}
                            style={{
                                position: "relative",
                                background: isSelected
                                    ? "rgba(227,203,44,0.13)"
                                    : "rgba(13,42,110,0.55)",
                                border: `2px solid ${isSelected ? "#e3cb2c" : "rgba(227,203,44,0.18)"}`,
                                borderRadius: 10,
                                padding: "12px 6px 8px",
                                cursor: saving ? "not-allowed" : "pointer",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 7,
                                transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s, transform 0.15s",
                                transform: isSelected ? "translateY(-2px) scale(1.04)" : "scale(1)",
                                boxShadow: isSelected
                                    ? "0 0 14px rgba(227,203,44,0.30), inset 0 0 0 1px rgba(227,203,44,0.15)"
                                    : "none",
                                opacity: saving ? 0.55 : 1,
                            }}
                            onMouseEnter={e => {
                                if (!isSelected && !saving) {
                                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(227,203,44,0.5)";
                                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(13,42,110,0.85)";
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isSelected) {
                                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(227,203,44,0.18)";
                                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(15,37,87,0.55)";
                                }
                            }}
                        >
                            {isSelected && (
                                <span style={{
                                    position: "absolute",
                                    top: 5,
                                    right: 6,
                                    width: 14,
                                    height: 14,
                                    borderRadius: "50%",
                                    background: "#e3cb2c",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 9,
                                    color: "#0f2557",
                                    fontWeight: "bold",
                                    lineHeight: 1,
                                }}>
                                    ✓
                                </span>
                            )}
                            <img
                                src={url}
                                alt={label}
                                width={64}
                                height={64}
                                style={{
                                    borderRadius: "50%",
                                    display: "block",
                                    border: isSelected
                                        ? "2px solid #e3cb2c"
                                        : "2px solid rgba(227,203,44,0.25)",
                                    transition: "border-color 0.15s",
                                    backgroundColor: "transparent",
                                }}
                            />
                            <span style={{
                                color: isSelected ? "#e3cb2c" : "#8da4cc",
                                fontFamily: "Georgia, serif",
                                fontSize: "0.67rem",
                                letterSpacing: "0.06em",
                                textAlign: "center",
                                textTransform: "uppercase",
                                transition: "color 0.15s",
                            }}>
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Footer */}
            <div style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 10,
                padding: "14px 24px 20px",
                borderTop: "1px solid rgba(227,203,44,0.15)",
            }}>
                <button
                    className="panel-icon-btn"
                    onClick={onClose}
                    disabled={saving}
                    style={{ padding: "0 18px", height: 36, fontSize: "0.85rem" }}
                >
                    Cancel
                </button>
                <button
                    className="panel-primary-btn"
                    onClick={() => selected && onSave(selected)}
                    disabled={!selected || saving}
                    style={{
                        width: "auto",
                        padding: "0 28px",
                        opacity: (!selected || saving) ? 0.5 : 1,
                        cursor: (!selected || saving) ? "not-allowed" : "pointer",
                    }}
                >
                    {saving ? "Saving…" : "Save Avatar"}
                </button>
            </div>
        </Modal>
        </ConfigProvider>
    );
};

export default AvatarPicker;
