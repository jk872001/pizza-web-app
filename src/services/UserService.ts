import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { Roles } from "../constants";

export class UserService {
   constructor(private userRepository: Repository<User>) {}

   async create({ firstName, lastName, email, password }: UserData) {
      const existingUser = await this.userRepository.findOne({
         where: { email: email },
      });
      if (existingUser) {
         const error = createHttpError(400, "Email Already exists");
         throw error;
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      try {
         return await this.userRepository.save({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: Roles.CUSTOMER,
         });
      } catch (err) {
         const error = createHttpError(500, "failed to store data in db");
         throw error;
      }
   }
   async findByEmail(email: string) {
      return await this.userRepository.findOne({
         where: { email },
      });
   }

   async findById(id: number) {
      return await this.userRepository.findOne({
          where: {
              id,
          },
         //  relations: {
         //      tenant: true,
         //  },
      });
  }
}

// 500 is the database error
