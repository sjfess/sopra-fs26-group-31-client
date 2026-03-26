import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { App as AntdApp, ConfigProvider, theme } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@/styles/globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Historical Reconstruction",
    description: "Rebuild the past, card by card.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ConfigProvider
            theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                    colorPrimary: "#e3cb2c",       // Gold als Primärfarbe
                    borderRadius: 8,
                    colorText: "#ffffff",
                    fontSize: 16,
                    colorBgContainer: "#1a3570",   // Navy als Container-Hintergrund
                    fontFamily: "Georgia, serif",
                },
                components: {
                    Button: {
                        colorPrimary: "#e3cb2c",     // Gold für alle Buttons
                        colorText: "#0f2557",        // Dunkles Navy als Button-Text
                        algorithm: true,
                        controlHeight: 44,
                    },
                    Input: {
                        colorBgContainer: "#1e4080",
                        colorBorder: "#e3cb2c",
                        colorTextPlaceholder: "#8899bb",
                        colorText: "#ffffff",
                        algorithm: false,
                    },
                    Form: {
                        labelColor: "#e3cb2c",
                        algorithm: theme.defaultAlgorithm,
                    },
                    Select: {
                        colorBgContainer: "#1e4080",
                        colorBorder: "#e3cb2c",
                        colorText: "#ffffff",
                    },
                },
            }}
        >
            <AntdRegistry>
                <div className="app-shell">
                    <AntdApp>{children}</AntdApp>
                </div>
            </AntdRegistry>
        </ConfigProvider>
        </body>
        </html>
    );
}