import { DataSource } from "typeorm";
import app from "../../src/app";
import request from "supertest";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
// import { truncateTable } from "../utils";

describe("POST /auth/register", () => {
   let connection: DataSource;

   // it will help in clearing the database everytime as it is imp that db is empty for every particular test case.

   beforeAll(async () => {
      connection = await AppDataSource.initialize();
   });

   beforeEach(async () => {
      // database truncate
      // await truncateTable(connection)

      await connection.dropDatabase();
      await connection.synchronize();
   });

   afterAll(async () => {
      await connection.destroy();
   });

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
         await request(app).post("/auth/register").send(userData);
         // Assert
         const userRepository = connection.getRepository(User);
         const users = await userRepository.find();
         expect(users).toHaveLength(1);
         expect(users[0].firstName).toBe(userData.firstName);
         expect(users[0].lastName).toBe(userData.lastName);
         expect(users[0].email).toBe(userData.email);
      });

      it("should assign role customer", async () => {
         // Arrange
         const userData = {
            firstName: "Jitesh",
            lastName: "Kumar",
            email: "jiteshkumar@gmail.com",
            password: "123432",
         };
         // Act
         await request(app).post("/auth/register").send(userData);
         // Assert
         const userRepository = connection.getRepository(User);
         const users = await userRepository.find();
         expect(users[0].role).toBe(Roles.CUSTOMER);
      });

      it("should store hashed password in database", async () => {
         // Arrange
         const userData = {
            firstName: "Jitesh",
            lastName: "Kumar",
            email: "jiteshkumar@gmail.com",
            password: "123432",
         };
         // Act
         await request(app).post("/auth/register").send(userData);
         // Assert
         const userRepository = connection.getRepository(User);
         const users = await userRepository.find();
         expect(users[0].password).not.toBe(userData.password);
         expect(users[0].password).toHaveLength(60);
         //   one more expect is need to write
      });
      it("should return 400 status code if email is already present", async () => {
         // Arrange
         const userData = {
            firstName: "Jitesh",
            lastName: "Kumar",
            email: "jiteshkumar@gmail.com",
            password: "123432",
         };
         // we have to store the data in the db for this test case
         const userRepository = connection.getRepository(User);
         await userRepository.save({ ...userData, role: Roles.CUSTOMER });
         // Act
         const response = await request(app)
            .post("/auth/register")
            .send(userData);
         // Assert
         const users = await userRepository.find();
         expect(response.statusCode).toBe(400);
         expect(users).toHaveLength(1);
      });

      it.todo("should return id ");
   });
   describe("Given all fields", () => {});
});
