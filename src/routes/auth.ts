import { UserService } from "./../services/UserService";
import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controller/AuthController";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import registerValidator from "../validators/registerValidator";
const router = express.Router();

// database
const userRepository = AppDataSource.getRepository(User);

// vanilla logic
const userService = new UserService(userRepository);

// framework logic
const authController = new AuthController(userService, logger);

router.post(
   "/register",
   registerValidator,
   (req: Request, res: Response, next: NextFunction) =>
      authController.register(req, res, next),
);

export default router;
