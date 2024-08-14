import { UserService } from "./../services/UserService";
import express, { NextFunction, Request, RequestHandler, Response } from "express";
import { AuthController } from "../controller/AuthController";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import registerValidator from "../validators/registerValidator";
import { TokenService } from "../services/TokenService";
import { RefreshToken } from "../entity/RefreshToken";
import { CredentialService } from "../services/CredentialService";
import loginValidator from "../validators/loginValidator";
import authenticate from "../middlewares/authenticate";
import validateRefreshToken from "../middlewares/validateRefreshToken";
import parseRefreshToken from "../middlewares/parseRefreshToken";
import { AuthRequest } from "../types";

const router = express.Router();

// database
const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

// vanilla logic
const userService = new UserService(userRepository);
const tokenService = new TokenService(refreshTokenRepository);
const credentialService = new CredentialService();

// framework logic
const authController = new AuthController(userService, logger,tokenService,credentialService);

router.post(
   "/register",
   registerValidator,
   (req: Request, res: Response, next: NextFunction) =>
      authController.register(req, res, next),
);
router.post(
   "/login",
   loginValidator,
   (req: Request, res: Response, next: NextFunction) =>
      authController.login(req, res, next),
);

router.get(
   "/self",
   authenticate as RequestHandler,
   (req: Request, res: Response) =>
       authController.self(
           req as AuthRequest,
           res,
       ) as unknown as RequestHandler,
);

router.post(
   "/refresh",
   validateRefreshToken as RequestHandler,
   (req: Request, res: Response, next: NextFunction) =>
       authController.refresh(
           req as AuthRequest,
           res,
           next,
       ) as unknown as RequestHandler,
);

router.post(
   "/logout",
   authenticate as RequestHandler,
   parseRefreshToken as RequestHandler,
   (req: Request, res: Response, next: NextFunction) =>
       authController.logout(
           req as AuthRequest,
           res,
           next,
       ) as unknown as RequestHandler,
);
export default router;
