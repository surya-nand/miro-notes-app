const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = require("../../index.js");
const notesUsers = require("../../models/user.js");

jest.mock("../../models/user.js");
jest.mock("jsonwebtoken");

describe("registerUser", () => {
  it("should register a new user successfully", async () => {
    const mockExistingUser = null;
    const mockHashedPassword = "mockHashedPassword";

    // Mocking functions
    bcrypt.genSalt = jest.fn().mockResolvedValue("mockSalt");
    bcrypt.hash = jest.fn().mockResolvedValue(mockHashedPassword);
    notesUsers.findOne = jest.fn().mockResolvedValue(mockExistingUser);
    notesUsers.prototype.save = jest.fn().mockResolvedValue();

    const userData = {
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    };

    const response = await request(app).post("/api/auth/signup").send(userData);

    // Assertions
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Registration Successful. Please Login");
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, "mockSalt");
    expect(notesUsers.findOne).toHaveBeenCalledWith({ email: userData.email });
    expect(notesUsers.prototype.save).toHaveBeenCalled();
  });

  it("should return an error when passwords do not match", async () => {
    const userData = {
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password456",
    };

    const response = await request(app).post("/api/auth/signup").send(userData);

    // Assertions
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Passwords do not match");
  });

  it("should return an error when email is already registered", async () => {
    const mockExistingUser = { email: "test@example.com" };
    notesUsers.findOne = jest.fn().mockResolvedValue(mockExistingUser);

    const userData = {
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    };

    const response = await request(app).post("/api/auth/signup").send(userData);

    // Assertions
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Email already registered");
  });

  it("should return a server error when an exception occurs", async () => {
    notesUsers.findOne = jest
      .fn()
      .mockRejectedValue(new Error("Some server error"));

    const userData = {
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    };

    const response = await request(app).post("/api/auth/signup").send(userData);

    // Assertions
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Server error");
  });
});

describe("loginUser", () => {
  it("should log in a user successfully", async () => {
    const mockUser = {
      email: "test@example.com",
      password: "mockHashedPassword",
    };

    // Mocking functions
    notesUsers.findOne = jest.fn().mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue("mockToken");

    const userData = {
      email: "test@example.com",
      password: "password123",
    };

    const response = await request(app).post("/api/auth/login").send(userData);

    // Assertions
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Login Successful");
    expect(response.body.token).toBe("mockToken");
    expect(response.body.userDetails).toEqual(mockUser);
  });

  it("should return an error for invalid credentials", async () => {
    const userData = {
      email: "test@example.com",
      password: "invalidPassword",
    };

    // Mocking functions
    notesUsers.findOne = jest.fn().mockResolvedValue(null);

    const response = await request(app).post("/api/auth/login").send(userData);

    // Assertions
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid Credentials");
  });

  it("should return a server error when an exception occurs", async () => {
    notesUsers.findOne = jest
      .fn()
      .mockRejectedValue(new Error("Some server error"));

    const userData = {
      email: "test@example.com",
      password: "password123",
    };

    const response = await request(app).post("/api/auth/login").send(userData);

    // Assertions
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Internal server error");
  });
});
