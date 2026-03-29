import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Register from "@/register/page";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock useApi
const mockPost = vi.fn();
vi.mock("@/hooks/useApi", () => ({
  useApi: () => ({ post: mockPost }),
}));

// Mock antd message
vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    message: { success: vi.fn() },
  };
});

describe("Register page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the register form", () => {
    render(<Register />);
    expect(screen.getByRole("heading", { name: "Register" })).toBeDefined();
    expect(screen.getByPlaceholderText("Enter username")).toBeDefined();
    expect(screen.getByPlaceholderText("Enter password")).toBeDefined();
    expect(screen.getByPlaceholderText("Repeat password")).toBeDefined();
  });

  it("renders the login navigation button", () => {
    render(<Register />);
    expect(screen.getByText("Log In")).toBeDefined();
  });

  it("navigates to /login when Log In is clicked", async () => {
    render(<Register />);
    fireEvent.click(screen.getByText("Log In"));
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("calls the register API and redirects to /login on success", async () => {
    mockPost.mockResolvedValueOnce({});
    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText("Enter username"), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repeat password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/users", expect.objectContaining({
        username: "newuser",
        password: "password123",
      }));
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("shows an alert when registration fails", async () => {
    mockPost.mockRejectedValueOnce(new Error("Username already exists"));
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText("Enter username"), {
      target: { value: "takenuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repeat password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        expect.stringContaining("Username already exists")
      );
    });
  });
});
