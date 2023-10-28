import app from "../../src/app";
import request from "supertest";

describe("POST /auth/register", () => {
   describe("Given all fields", () => {
      it("should return 201 status code", async () => {
         // Arrange
         const userData = {
            firstName: "Jitesh",
            lastName: "Kumar",
            email: "jiteshkumar@gmail.com",
            password: "123432",
         };
         // Act
         const response = await request(app)
            .post("/auth/register")
            .send(userData);
         // Assert
         expect(response.statusCode).toBe(201);
      });

      it("should return valid json", async () => {
         // Arrange
         const userData = {
            firstName: "Jitesh",
            lastName: "Kumar",
            email: "jiteshkumar@gmail.com",
            password: "123432",
         };
         // Act
         const response = await request(app)
            .post("/auth/register")
            .send(userData);
         // Assert
         expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("json"),
         );
      });
   });
   describe("Given all fields", () => {});
});
