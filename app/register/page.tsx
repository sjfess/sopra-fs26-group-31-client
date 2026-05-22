"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import { Button, Form, Input, App } from "antd";
import useSessionStorage from "@/hooks/useSessionStorage";
import { useState } from "react";
import AppNavbar from "@/components/AppNavbar";
import { ApplicationError } from "@/types/ApplicationError";


interface FormFieldProps {
    username: string;
    password: string;
    confirmPassword: string;
}

const Register: React.FC = () => {
    const router = useRouter();
    const apiService = useApi();
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { set: setToken } = useSessionStorage<string>("token", "");
    const { set: setId } = useSessionStorage<number>("userId", 0);
    const { set: setUsername } = useSessionStorage<string>("username", "");





    const handleRegister = async (values: FormFieldProps) => {
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        try {
            const {confirmPassword, ...userData} = values;
            const user = await apiService.post<User>("/users", userData);

            // im handleRegister:
            if (user.token) {setToken(user.token);}
            if (user.id) {setId(Number(user.id));}
            if (user.username) {setUsername(user.username);}

            if (!user.id){console.error("No userId set")
            }

            message.success({
                content: (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <strong style={{ color: "#e3cb2c" }}>Successful registration!</strong>
                        <span style={{ color: "black", fontSize: "0.9rem" }}>Enjoy the game</span>
                    </div>
                ),
                icon: <span>🏆</span>,
                duration: 4,
            });

            router.push(`/profile/${user.id}`);
        } catch (error) {
            if (error instanceof Error) {
                const appError = error as ApplicationError;

                if (appError.status === 409) {
                    message.error({
                        content: (
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <strong style={{ color: "#ff4d4f" }}>Username already taken</strong>
                                <span style={{ color: "black", fontSize: "0.90rem" }}>
                                Please choose a different username.
                            </span>
                            </div>
                        ),
                        icon: <span>🚫</span>,
                        duration: 5,
                    });
                } else {
                    message.error(`Registration failed: ${error.message}`);
                }
            } else {
                console.error("An unknown error occurred during registration.");
                message.error("Registration failed. Please try again.");
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
                        <h1>Register</h1>
                    </div>
                    <div className="auth-card-body">
                        <p>Create your Historical Reconstruction account</p>

                        <Form
                            form={form}
                            name="register"
                            size="large"
                            variant="outlined"
                            onFinish={handleRegister}
                            layout="vertical"
                        >
                            <Form.Item
                                name="username"
                                label="Username"
                                rules={[
                                    { required: true, message: "Please input your username!" },
                                    { max: 30, message: "Username must be 30 characters or fewer." },
                                ]}
                            >
                                <Input placeholder="Enter username" maxLength={30} />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[
                                    { required: true, message: "Please input your password!" },
                                    { max: 30, message: "Password must be 30 characters or fewer." },
                                ]}
                            >
                                <Input.Password placeholder="Enter password" maxLength={30} />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                label="Confirm Password"
                                rules={[
                                    { required: true, message: "Please confirm your password!" },
                                    { max: 30, message: "Password must be 30 characters or fewer." },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue("password") === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error("Passwords do not match!"));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder="Repeat password" maxLength={30} />
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
                                    Register
                                </Button>
                            </Form.Item>
                        </Form>

                        <div style={{ textAlign: "center", marginTop: "20px" }} className="muted-text">
                            Already have an account?
                            <br />
                            <Button
                                onClick={() => router.push("/login")}
                                className="auth-btn-ghost"
                                style={{ marginTop: "8px" }}
                            >
                                Log In
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Register;
