const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/lib/prisma");

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
});

describe("POST /api/auth/register", () => {
  test("creates user in PostgreSQL and returns tokens", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Samrawit",
      email: "sam@example.com",
      password: "secret1",
    });

    expect(res.status).toBe(201);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();

    const count = await prisma.user.count();
    expect(count).toBe(1);
  });
});

describe("POST /api/auth/login", () => {
  test("returns tokens for valid credentials", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Sam",
      email: "sam@example.com",
      password: "secret1",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "sam@example.com",
      password: "secret1",
    });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });
});

describe("GET /api/auth/me", () => {
  test("returns profile with valid access token", async () => {
    const reg = await request(app).post("/api/auth/register").send({
      name: "Sam",
      email: "sam@example.com",
      password: "secret1",
    });

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${reg.body.data.accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe("sam@example.com");
  });
});

describe("POST /api/auth/logout", () => {
  test("removes refresh token from database", async () => {
    const reg = await request(app).post("/api/auth/register").send({
      name: "Sam",
      email: "sam@example.com",
      password: "secret1",
    });

    await request(app).post("/api/auth/logout").send({
      refreshToken: reg.body.data.refreshToken,
    });

    const count = await prisma.refreshToken.count();
    expect(count).toBe(0);
  });
});
