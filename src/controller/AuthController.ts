import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { Logger } from "winston";
import { UserService } from "../services/UserService";
import { RegisterUserRequest } from "../types";

export class AuthController {
   userService: UserService;
   logger: Logger;
   constructor(userService: UserService, logger: Logger) {
      this.userService = userService;
      this.logger = logger;
   }
   async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
      const result = validationResult(req);
      if (!result.isEmpty()) {
         return res.status(400).send({ errors: result.array() });
      }

      const { firstName, lastName, email, password } = req.body;

      try {
         await this.userService.create({
            firstName,
            lastName,
            email,
            password,
         });

         this.logger.info("User has been registered");

         const accessToken = "2ewd3e32d4f3fede";
         const refreshToken = "2ewd3e32d4f3fede";

         res.cookie("accessToken", accessToken, {
            domain: "localhost",
            sameSite: true,
            maxAge: 1000 * 60 * 60, // 1hr
            httpOnly: true,  //very imp
         });

         res.cookie("refreshToken", refreshToken, {
            domain: "localhost",
            sameSite: true,
            maxAge: 1000 * 60 * 60 * 24, // 1day
            httpOnly: true, //very imp
         });

         res.status(201).json();
      } catch (err) {
         // here we are using next as we want to pass the err to global error handler
         next(err);
         return;
      }
   }
}
