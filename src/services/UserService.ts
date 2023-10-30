import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../constants";

export class UserService {
   constructor(private userRepository: Repository<User>) {}

   async create({ firstName, lastName, email, password }: UserData) {
      try {
         await this.userRepository.save({
            firstName,
            lastName,
            email,
            password,
            role:Roles.CUSTOMER
         });
      } catch (err) {
         const error = createHttpError(500, "failed to store data in db");
         throw error;
      }
   }
}



// 500 is the database error 