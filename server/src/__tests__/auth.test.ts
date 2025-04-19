import request from "supertest";
import express from "express";
import authRouter from "../routes/auth";
import httpStatus from "http-status";

const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);

describe("Auth Routes", () => {
    describe("POST /api/auth/register", () => {
        it("should register a new user successfully", async () => {
            const userData = {
                name: "Test User",
                username: "testuser",
                email: "test@example.com",
                password: "password123",
            };

            const response = await request(app)
                .post("/api/auth/register")
                .send(userData);

            expect(response.status).toBe(httpStatus.OK);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty("_id");
            expect(response.body.data.email).toBe(userData.email);
            expect(response.body.data.name).toBe(userData.name);
            expect(response.body.data.username).toBe(userData.username);
        });

        it("should not register a user with existing email or username", async () => {
            const userData = {
                name: "Test User",
                username: "testuser",
                email: "test@example.com",
                password: "password123",
            };

            // First registration
            await request(app).post("/api/auth/register").send(userData);

            // Second registration with same email
            const response1 = await request(app)
                .post("/api/auth/register")
                .send(userData);

            expect(response1.status).toBe(httpStatus.BAD_REQUEST);
            expect(response1.body.success).toBe(false);
            expect(response1.body.error.message).toBe(
                "User already exists with this email or username"
            );

            // Second registration with same username but different email
            const response2 = await request(app)
                .post("/api/auth/register")
                .send({
                    ...userData,
                    email: "different@example.com",
                });

            expect(response2.status).toBe(httpStatus.BAD_REQUEST);
            expect(response2.body.success).toBe(false);
            expect(response2.body.error.message).toBe(
                "User already exists with this email or username"
            );
        });
    });

    describe("POST /api/auth/login", () => {
        beforeEach(async () => {
            // Create a test user before each login test
            const userData = {
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            };

            await request(app).post("/api/auth/register").send(userData);
        });

        it("should login successfully with correct credentials", async () => {
            const loginData = {
                email: "test@example.com",
                password: "password123",
            };

            const response = await request(app)
                .post("/api/auth/login")
                .send(loginData);

            expect(response.status).toBe(httpStatus.OK);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty("token");
            expect(response.body.data.email).toBe(loginData.email);
        });

        it("should not login with incorrect password", async () => {
            const loginData = {
                email: "test@example.com",
                password: "wrongpassword",
            };

            const response = await request(app)
                .post("/api/auth/login")
                .send(loginData);

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toBe(
                "Email or password is incorrect"
            );
        });

        it("should not login with non-existent email", async () => {
            const loginData = {
                email: "nonexistent@example.com",
                password: "password123",
            };

            const response = await request(app)
                .post("/api/auth/login")
                .send(loginData);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toBe(
                "Email or password is incorrect"
            );
        });
    });
});
