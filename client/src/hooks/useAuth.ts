// Mock user data for demo without authentication
const mockUser = {
  id: "demo-user-123",
  email: "student@university.edu",
  firstName: "John",
  lastName: "Doe",
  profileImageUrl: "",
  university: "Tech University",
  major: "Computer Science",
  ecoPoints: 250,
  rating: "4.8",
  reviewCount: 12,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function useAuth() {
  return {
    user: mockUser,
    isLoading: false,
    isAuthenticated: true,
  };
}
