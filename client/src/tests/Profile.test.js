import { render, screen } from "@testing-library/react";
import Profile from "../components/Profile";

let mockIsAuthenticated = true;

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  Auth0Provider: ({ children }) => children,
  useAuth0: () => {
    return {
      isLoading: false,
      user: {
        sub: "subId",
        email: "susie.yu19990420@gmail.com",
        email_verified: true,
      },
      isAuthenticated: mockIsAuthenticated,
      loginWithRedirect: jest.fn(),
    };
  },
}));

test("renders Profile", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Profile />
    </MemoryRouter>
  );

 
  expect(screen.getByText("📧 Email: susie.yu19990420@gmail.com")).toBeInTheDocument();
  expect(screen.getByText("🔑 Auth0Id: subId")).toBeInTheDocument();
  expect(screen.getByText("✅ Email verified: true")).toBeInTheDocument();
});
