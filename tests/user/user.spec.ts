import createJWKSMock from "mock-jwks";
import request from "supertest";
import { DataSource } from "typeorm";

import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { Roles } from "../../src/constants";
import { User } from "../../src/entity/User";

describe("GET /auth/self", () => {
   let connection: DataSource;
   let jwks: ReturnType<typeof createJWKSMock>;

   beforeAll(async () => {
      jwks = createJWKSMock("http://127.0.0.1:5000"); //creating mock server for generating token
      connection = await AppDataSource.initialize();
   });

   beforeEach(async () => {
      jwks.start();
      await connection.dropDatabase();
      await connection.synchronize();
   });

   afterEach(() => {
      jwks.stop();
   });

   afterAll(async () => {
      await connection.destroy();
   });

   describe("Given all fields", () => {
      it("should return the 200 status code", async () => {
         const accessToken = jwks.token({
            sub: "1",
            role: Roles.CUSTOMER,
         });
         const response = await request(app)
            .get("/auth/self")
            .set("Cookie", [`accessToken=${accessToken}`])
            .send();
         expect(response.statusCode).toBe(200);
      });

      it("should return the user data", async () => {
         // Register user
         const userData = {
            firstName: "Rakesh",
            lastName: "K",
            email: "rakesh@mern.space",
            password: "password",
         };
         const userRepository = connection.getRepository(User);
         const data = await userRepository.save({
            ...userData,
            role: Roles.CUSTOMER,
         });
         // Generate token
         const accessToken = jwks.token({
            sub: String(data.id),
            role: data.role,
         });

         // Add token to cookie
         const response = await request(app)
            .get("/auth/self")
            .set("Cookie", [`accessToken=${accessToken};`])
            .send();
         // Assert
         // Check if user id matches with registered user
         expect((response.body as Record<string, string>).id).toBe(data.id);
      });

      it("should not return the password field", async () => {
         // Register user
         const userData = {
            firstName: "Rakesh",
            lastName: "K",
            email: "rakesh@mern.space",
            password: "password",
         };
         const userRepository = connection.getRepository(User);
         const data = await userRepository.save({
            ...userData,
            role: Roles.CUSTOMER,
         });
         // Generate token
         const accessToken = jwks.token({
            sub: String(data.id),
            role: data.role,
         });

         // Add token to cookie
         const response = await request(app)
            .get("/auth/self")
            .set("Cookie", [`accessToken=${accessToken};`])
            .send();
         // Assert
         // Check if user id matches with registered user
         expect(response.body as Record<string, string>).not.toHaveProperty(
            "password",
         );
      });

      it("should return 401 status code if token does not exists", async () => {
         // Register user
         const userData = {
            firstName: "Rakesh",
            lastName: "K",
            email: "rakesh@mern.space",
            password: "password",
         };
         const userRepository = connection.getRepository(User);
         await userRepository.save({
            ...userData,
            role: Roles.CUSTOMER,
         });

         // Add token to cookie
         const response = await request(app).get("/auth/self").send();
         // Assert
         expect(response.statusCode).toBe(401);
      });
   });
});