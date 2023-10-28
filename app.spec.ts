import app from "./src/app";
import { calculateSum } from "./src/utils";
import  request  from "supertest";


describe('sum module', () => {
    it('should add', () => {
          const result=calculateSum(5,5);
          expect(result).toBe(10)
    });
    it('should call api', async() => {
          const response=await request(app).get("/").send()
          expect(response.statusCode).toBe(200)
    });
  });