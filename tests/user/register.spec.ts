import {  DataSource } from "typeorm";
import app from "../../src/app";
import request from "supertest";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { truncateTable } from "../utils";



describe("POST /auth/register", () => {
    let connection:DataSource

    // it will help in clearing the database everytime as it is imp that db is empty for every particular test case.

    beforeAll(async()=>
    {
        connection= await AppDataSource.initialize()
    })

    beforeEach(async()=>
    {
        // database truncate
         await truncateTable(connection)
    })

    afterAll(async()=>
    {
       await connection.destroy()
    })

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

      it("should persist the user in database", async () => {
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
          const userRepository= connection.getRepository(User)
          const users= await userRepository.find()
          expect(users).toHaveLength(1)
          expect(users[0].firstName).toBe(userData.firstName)
          expect(users[0].lastName).toBe(userData.lastName)
          expect(users[0].email).toBe(userData.email)

      });
   });
   describe("Given all fields", () => {});
});
