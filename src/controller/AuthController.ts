import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";

export class AuthController {
   userService: UserService;
   logger: Logger;
   constructor(userService: UserService, logger: Logger) {
      this.userService = userService;
      this.logger = logger;
   }
   async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
      const { firstName, lastName, email, password } = req.body;

      try {
        await this.userService.create({
            firstName,
            lastName,
            email,
            password,
         });

         this.logger.info("User has been registered");

         res.status(201).json();
      } catch (err) {
         // here we are using next as we want to pass the err to global error handler
         next(err);
         return;
      }
   }
}
