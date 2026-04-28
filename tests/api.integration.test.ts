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

  it("auth refresh accepts empty body for cookie-based flow", async () => {
    authService.refresh.mockResolvedValue({
      accessToken: "new-access-token",
    });

    const response = await request(app).post("/api/v1/auth/refresh").send({});

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBe("new-access-token");
    expect(authService.refresh).toHaveBeenCalledWith(undefined);
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
    expect(obrasService.list).toHaveBeenCalledWith(
      expect.objectContaining({
        q: "Samuel",
        tecnicaId: 1,
        page: 1,
        limit: 20,
      }),
    );
  });

  it("obras list accepts snake_case tecnica_id as filter", async () => {
    obrasService.list.mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 20,
    });

    const response = await request(app).get(
      "/api/v1/obras?tecnica_id=2&page=1&limit=20",
    );

    expect(response.status).toBe(200);
    expect(obrasService.list).toHaveBeenCalledWith(
      expect.objectContaining({
        tecnicaId: 2,
        page: 1,
        limit: 20,
      }),
    );
  });

  it("autores by id rejects invalid numeric param", async () => {
    const response = await request(app).get("/api/v1/autores/NaN");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation error");
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

  it("rejects admin create when token is missing", async () => {
    const response = await request(app).post("/api/v1/obras").send({
      id: "999",
      titulo: "Nueva Obra",
      autor_id: 1,
      tecnica_id: 1,
    });

    expect(response.status).toBe(401);
    expect(obrasService.create).not.toHaveBeenCalled();
  });

  it("rejects admin create for non-admin role", async () => {
    const token = jwt.sign(
      { sub: 2, email: "viewer@test.com", role: "viewer", type: "access" },
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

    expect(response.status).toBe(403);
    expect(obrasService.create).not.toHaveBeenCalled();
  });
});
