const bcrypt = require("bcryptjs");

jest.mock("../src/modules/auth/auth.repository", () => ({
  findAdminByEmail: jest.fn(),
  updateRefreshTokenHash: jest.fn(),
}));

const authRepository = require("../src/modules/auth/auth.repository");
const authService = require("../src/modules/auth/auth.service");

describe("auth.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns access and refresh token on valid login", async () => {
    const passwordHash = await bcrypt.hash("supersecure123", 10);
    authRepository.findAdminByEmail.mockResolvedValue({
      id: 1,
      email: "admin@test.com",
      password_hash: passwordHash,
      role: "admin",
      is_active: true,
    });
    authRepository.updateRefreshTokenHash.mockResolvedValue(undefined);

    const result = await authService.login("admin@test.com", "supersecure123");

    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
    expect(result.user.role).toBe("admin");
  });
});
