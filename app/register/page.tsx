"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import { Button, Form, Input, App } from "antd";
import useLocalStorage from "@/hooks/useLocalStorage";


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
    const { set: setToken } = useLocalStorage<string>("token", "");
    const { set: setId } = useLocalStorage<number>("userId", 0);
    const { set: setUsername } = useLocalStorage<string>("username", "");





    const handleRegister = async (values: FormFieldProps) => {
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
                        <span style={{ color: "#cdd8f0", fontSize: "0.85rem" }}>Enjoy the game</span>
                    </div>
                ),
                icon: <span>🏆</span>,
                duration: 4,
            });

            router.push(`/profile/${user.id}`);
        } catch (error) {
            if (error instanceof Error) {
                alert(`Something went wrong during registration:\n${error.message}`);
            } else {
                console.error("An unknown error occurred during registration.");
            }
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                backgroundColor: "#0f2557",
            }}
        >

            <nav className="app-navbar" style={{ flexShrink: 0 }}>
                <span className="app-navbar-title">Historical Reconstruction</span>
                <span
                    onClick={() => router.push("/")}
                    style={{ cursor: "pointer", color: "white" }}
                >
          Back
        </span>
            </nav>


            <main
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "24px",
                }}
            >
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

                            <Form.Item
                                name="confirmPassword"
                                label="Confirm Password"
                                rules={[
                                    { required: true, message: "Please confirm your password!" },
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
                                <Input.Password placeholder="Repeat password" />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: 0 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    style={{
                                        borderRadius: "999px",
                                        height: "48px",
                                        fontSize: "1.1rem",
                                        fontFamily: "Georgia, serif",
                                        fontWeight: "bold",
                                        backgroundColor: "#e3cb2c",
                                        borderColor: "#e3cb2c",
                                        color: "#0f2557",
                                    }}
                                >
                                    Register
                                </Button>
                            </Form.Item>
                        </Form>

                        <div style={{ textAlign: "center", marginTop: "20px", color: "#cdd8f0" }}>
                            Already have an account?
                            <br />
                            <Button
                                onClick={() => router.push("/login")}
                                style={{
                                    marginTop: "8px",
                                    borderRadius: "999px",
                                    borderColor: "#e3cb2c",
                                    color: "white",
                                    backgroundColor: "transparent",
                                    fontWeight: "bold",
                                }}
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