const request = require("supertest");
const jwt = require("jsonwebtoken");

jest.mock("../src/modules/auth/auth.service", () => ({
  login: jest.fn(),
  refresh: jest.fn(),
}));

jest.mock("../src/modules/obras/obras.service", () => ({
  list: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  patch: jest.fn(),
  remove: jest.fn(),
  facets: jest.fn(),
}));

const authService = require("../src/modules/auth/auth.service");
const obrasService = require("../src/modules/obras/obras.service");
const { app } = require("../src/app");

describe("API integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("health endpoint is alive", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("auth login returns tokens", async () => {
    authService.login.mockResolvedValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: { id: 1, email: "admin@test.com", role: "admin" },
    });

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "admin@test.com",
      password: "supersecure123",
    });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBe("access-token");
  });

  it("obras list supports filtros query", async () => {
    obrasService.list.mockResolvedValue({
      data: [{ id: "103", titulo: "Samuel Cock" }],
      total: 1,
      page: 1,
      limit: 20,
    });

    const response = await request(app).get(
      "/api/v1/obras?q=Samuel&tecnicaId=1&page=1&limit=20",
    );

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(1);
    expect(obrasService.list).toHaveBeenCalled();
  });

  it("admin token can create obra", async () => {
    obrasService.create.mockResolvedValue({ id: "999", titulo: "Nueva Obra" });
    const token = jwt.sign(
      { sub: 1, email: "admin@test.com", role: "admin", type: "access" },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );

    const response = await request(app)
      .post("/api/v1/obras")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: "999",
        titulo: "Nueva Obra",
        autor_id: 1,
        tecnica_id: 1,
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBe("999");
  });
});
