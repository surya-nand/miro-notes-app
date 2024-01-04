const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../index.js");
const verifyToken = require("../../middleware/authMiddleware");

jest.mock("jsonwebtoken");

describe("verifyToken middleware", () => {

  it("should return Unauthorized for an invalid token", async () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error("Invalid token"));
    });

    const token = "invalidToken";
    const response = await request(app)
      .get("/api/notes")
      .set("Authorization", token);

    // Assertions
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Unauthorized-invalid-token");
    expect(jwt.verify).toHaveBeenCalledWith(
      token,
      process.env.SECRET_KEY,
      expect.any(Function)
    );
    expect(response.req.user).toBeUndefined(); // req.user should not be set for invalid tokens
  });

  it("should return Unauthorized for a missing token", async () => {
    const response = await request(app).get("/api/notes");

    // Assertions
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Unauthorized-missing-token");
    expect(response.req.user).toBeUndefined();
  });
});
