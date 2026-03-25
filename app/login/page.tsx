"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Form, Input } from "antd";

interface FormFieldProps {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();
  const { set: setToken } = useLocalStorage<string>("token", "");
  const { set: setUserId } = useLocalStorage<string>("userId", "");

  const handleLogin = async (values: FormFieldProps) => {
    try {
      const response = await apiService.post<User>("/auth/login", values);

      if (response.token) {
        setToken(response.token);
      }
      if (response.id) {
        setUserId(response.id);
      }

      router.push("/users");
    } catch (error) {
      if (error instanceof Error) {
        alert(`Something went wrong during the login:\n${error.message}`);
      } else {
        console.error("An unknown error occurred during login.");
      }
    }
  };

  return (
      <div className="centered-page">
        <nav className="app-navbar" style={{ position: "absolute", top: 0, left: 0, right: 0, margin: "12px" }}>
          <span className="app-navbar-title">Historical Reconstruction</span>
          <span onClick={() => router.push("/")} style={{ cursor: "pointer", color: "white" }}>
          Back
        </span>
        </nav>

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
                  Log In
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: "center", marginTop: "20px", color: "#cdd8f0" }}>
              Don&apos;t have an account?
              <br />
              <Button
                  onClick={() => router.push("/register")}
                  style={{
                    marginTop: "8px",
                    borderRadius: "999px",
                    borderColor: "#e3cb2c",
                    color: "white",
                    backgroundColor: "transparent",
                    fontWeight: "bold",
                  }}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Login;