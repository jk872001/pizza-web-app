import { UserService } from "./../services/UserService";
import express from "express";
import { AuthController } from "../controller/AuthController";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";

const router = express.Router();

// database
const userRepository = AppDataSource.getRepository(User);

// vanilla logic
const userService = new UserService(userRepository);

// framework logic
const authController = new AuthController(userService);

router.post("/register", (req, res) => authController.register(req, res));

export default router;
