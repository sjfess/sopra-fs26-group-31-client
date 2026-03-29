import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Login from "@/login/page";

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

// Mock useLocalStorage
vi.mock("@/hooks/useLocalStorage", () => ({
  default: () => ({ value: "", set: vi.fn(), clear: vi.fn() }),
}));

describe("Login page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the login form", () => {
    render(<Login />);
    expect(screen.getByRole("heading", { name: "Log In" })).toBeDefined();
    expect(screen.getByPlaceholderText("Enter username")).toBeDefined();
    expect(screen.getByPlaceholderText("Enter password")).toBeDefined();
  });

  it("renders the register navigation button", () => {
    render(<Login />);
    expect(screen.getByText("Register")).toBeDefined();
  });

  it("navigates to /register when Register is clicked", async () => {
    render(<Login />);
    fireEvent.click(screen.getByText("Register"));
    expect(mockPush).toHaveBeenCalledWith("/register");
  });

  it("calls the login API and redirects to /profile on success", async () => {
    mockPost.mockResolvedValueOnce({ token: "abc123", id: "1" });
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText("Enter username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/auth/login", expect.objectContaining({
        username: "testuser",
        password: "password123",
      }));
      expect(mockPush).toHaveBeenCalledWith("/profile");
    });
  });

  it("shows an alert when login fails", async () => {
    mockPost.mockRejectedValueOnce(new Error("Invalid credentials"));
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText("Enter username"), {
      target: { value: "wronguser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        expect.stringContaining("Invalid credentials")
      );
    });
  });
});