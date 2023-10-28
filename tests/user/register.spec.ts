import app from "../../src/app"
import  request  from "supertest";


describe("POST /auth/register",()=>
{
    describe("Given all fields",()=>
    {
         it("should return 201 status code",async()=>
         {
            // Arrange
            const userData={
                firstName:"Jitesh",
                lastName:"Kumar",
                email:"jiteshkumar@gmail.com",
                password:"123432"
            }
            // Act
            const response= await request(app).post("/auth/register").send(userData)
            // Asservative
            expect(response.statusCode).toBe(201)
         })
    })
    describe("Given all fields",()=>
    {

    })
})