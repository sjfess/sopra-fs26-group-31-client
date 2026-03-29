import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Profile from "@/profile/page";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock useApi
const mockGet = vi.fn();
const mockPost = vi.fn();
vi.mock("@/hooks/useApi", () => ({
  useApi: () => ({ get: mockGet, post: mockPost }),
}));

// Mock GameHub
vi.mock("@/profile/components/GameHub", () => ({
  default: () => <div>GameHub</div>,
}));

// Controllable localStorage mock
const mockClearToken = vi.fn();
const mockClearUserId = vi.fn();
let mockTokenValue = "";

vi.mock("@/hooks/useLocalStorage", () => ({
  default: (key: string) => {
    if (key === "token") return { value: mockTokenValue, set: vi.fn(), clear: mockClearToken };
    if (key === "userId") return { value: "1", set: vi.fn(), clear: mockClearUserId };
    return { value: "", set: vi.fn(), clear: vi.fn() };
  },
}));

describe("Profile page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTokenValue = "";
  });

  it("redirects to /login when no token is present", async () => {
    mockTokenValue = "";
    render(<Profile />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("displays user info after fetching", async () => {
    mockTokenValue = "abc123";
    mockGet.mockResolvedValueOnce({
      id: "1",
      username: "testuser",
      name: "Test User",
      status: "ONLINE",
      token: "abc123",
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/testuser/)).toBeDefined();
      expect(screen.getByText(/Test User/)).toBeDefined();
      expect(screen.getByText(/ONLINE/)).toBeDefined();
    });
  });

  it("logs out and redirects to /login when Log Out is clicked", async () => {
    mockTokenValue = "abc123";
    mockGet.mockResolvedValueOnce({
      id: "1",
      username: "testuser",
      name: null,
      status: "ONLINE",
      token: "abc123",
    });
    mockPost.mockResolvedValueOnce({});

    render(<Profile />);

    await waitFor(() => screen.getByText("Log Out"));
    fireEvent.click(screen.getByText("Log Out"));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/auth/logout", {});
      expect(mockClearToken).toHaveBeenCalled();
      expect(mockClearUserId).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });
});