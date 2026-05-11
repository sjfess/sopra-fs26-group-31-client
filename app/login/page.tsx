"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useSessionStorage from "@/hooks/useSessionStorage";
import { User } from "@/types/user";
import { useState } from "react";
import { App, Button, Form, Input } from "antd";
import AppNavbar from "@/components/AppNavbar";

interface FormFieldProps {
    username: string;
    password: string;
}

const Login: React.FC = () => {
    const router = useRouter();
    const apiService = useApi();
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { set: setToken } = useSessionStorage<string>("token", "");
    const { set: setUserId } = useSessionStorage<string>("userId", "");
    const { set: setUsername } = useSessionStorage<string>("username", "");

    const handleLogin = async (values: FormFieldProps) => {
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await apiService.post<User>("/auth/login", values);

            if (response.token) {
                setToken(response.token);
            }
            if (response.id) {
                setUserId(response.id);
            }
            if (response.username) {
                setUsername(response.username);
            }

            router.push(`/profile/${response.id}`);
        } catch (error) {
            if (error instanceof Error) {
                message.error(`Login failed: ${error.message}`);
            } else {
                console.error("An unknown error occurred during login.");
                message.error("Login failed. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="app-shell">
            <AppNavbar variant="minimal" />

            <main className="page-main-center">
                <div className="auth-card">
                    <div className="auth-card-header">
                        <h1>Log In</h1>
                    </div>
                    <div className="auth-card-body">
                        <p>Welcome back to Historical Reconstruction</p>

                        <Form
                            form={form}
                            name="login"
                            size="large"
                            variant="outlined"
                            onFinish={handleLogin}
                            layout="vertical"
                        >
                            <Form.Item
                                name="username"
                                label="Username"
                                rules={[{ required: true, message: "Please input your username!" }]}
                            >
                                <Input placeholder="Enter username" />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[{ required: true, message: "Please input your password!" }]}
                            >
                                <Input.Password placeholder="Enter password" />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: 0 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                    className="auth-btn-primary"
                                >
                                    Log In
                                </Button>
                            </Form.Item>
                        </Form>

                        <div style={{ textAlign: "center", marginTop: "20px" }} className="muted-text">
                            Don&apos;t have an account?
                            <br />
                            <Button
                                onClick={() => router.push("/register")}
                                className="auth-btn-ghost"
                                style={{ marginTop: "8px" }}
                            >
                                Register
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
