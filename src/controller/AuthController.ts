import { TokenService } from "./../services/TokenService";
import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { Logger } from "winston";
import { UserService } from "../services/UserService";
import { AuthRequest, JWTPayloadType, RegisterUserRequest } from "../types";
import createHttpError from "http-errors";
import { CredentialService } from "../services/CredentialService";
import { JwtPayload } from "jsonwebtoken";

export class AuthController {
   userService: UserService;
   logger: Logger;
   constructor(
      userService: UserService,
      logger: Logger,
      private tokenService: TokenService,
      private credentialService: CredentialService,
   ) {
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
         const user = await this.userService.create({
            firstName,
            lastName,
            email,
            password,
         });

         this.logger.info("User has been registered");

         const payload: JWTPayloadType = {
            sub: String(user.id),
            role: user.role,
         };

         const accessToken = this.tokenService.generateAccessToken(payload);

         // Persist the refresh token
         const newRefreshToken = await this.tokenService.persistRefreshToken(
            user!,
         );

         const refreshToken = this.tokenService.generateRefreshToken({
            ...payload,
            id: String(newRefreshToken.id),
         });

         res.cookie("accessToken", accessToken, {
            domain: "localhost",
            sameSite: true,
            maxAge: 1000 * 60 * 60, // 1hr
            httpOnly: true, //very imp
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

   async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
      const result = validationResult(req);
      if (!result.isEmpty()) {
         return res.status(400).send({ errors: result.array() });
      }

      const { email, password } = req.body;

      try {
         const user = await this.userService.findByEmail(email);

         if (!user) {
            const error = createHttpError(400, "Invalid Credentials");
            next(error);
            return;
         }

         const passwordMatch = this.credentialService.comparePassword(
            password,
            user.password,
         );

         if (!passwordMatch) {
            const error = createHttpError(400, "Invalid Credentials");
            next(error);
            return;
         }

         const payload: JWTPayloadType = {
            sub: String(user.id),
            role: user.role,
         };

         const accessToken = this.tokenService.generateAccessToken(payload);

         // Persist the refresh token
         const newRefreshToken = await this.tokenService.persistRefreshToken(
            user!,
         );

         const refreshToken = this.tokenService.generateRefreshToken({
            ...payload,
            id: String(newRefreshToken.id),
         });

         res.cookie("accessToken", accessToken, {
            domain: "localhost",
            sameSite: true,
            maxAge: 1000 * 60 * 60, // 1hr
            httpOnly: true, //very imp
         });

         res.cookie("refreshToken", refreshToken, {
            domain: "localhost",
            sameSite: true,
            maxAge: 1000 * 60 * 60 * 24, // 1day
            httpOnly: true, //very imp
         });

         this.logger.info("User has been logged In");
         res.status(200).json({ id: user.id });
      } catch (err) {
         // here we are using next as we want to pass the err to global error handler
         next(err);
         return;
      }
   }

   async self(req: AuthRequest, res: Response) {
      // token req.auth.id
      const user = await this.userService.findById(Number(req.auth.sub));
      res.json({ ...user, password: undefined });
   }

   async refresh(req: AuthRequest, res: Response, next: NextFunction) {
      try {
         const payload: JwtPayload = {
            sub: req.auth.sub,
            role: req.auth.role,
         };

         const accessToken = this.tokenService.generateAccessToken(payload);

         const user = await this.userService.findById(Number(req.auth.sub));
         if (!user) {
            const error = createHttpError(
               400,
               "User with the token could not find",
            );
            next(error);
            return;
         }

         // Persist the refresh token
         const newRefreshToken =
            await this.tokenService.persistRefreshToken(user);

         // Delete old refresh token
         await this.tokenService.deleteRefreshToken(Number(req.auth.id));

         const refreshToken = this.tokenService.generateRefreshToken({
            ...payload,
            id: String(newRefreshToken.id),
         });

         res.cookie("accessToken", accessToken, {
            domain: "localhost",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 1, // 1d
            httpOnly: true, // Very important
         });

         res.cookie("refreshToken", refreshToken, {
            domain: "localhost",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
            httpOnly: true, // Very important
         });

         this.logger.info("User has been logged in", { id: user.id });
         res.json({ id: user.id });
      } catch (err) {
         next(err);
         return;
      }
   }

   async logout(req: AuthRequest, res: Response, next: NextFunction) {
      try {
         await this.tokenService.deleteRefreshToken(Number(req.auth.id));
         this.logger.info("Refresh token has been deleted", {
            id: req.auth.id,
         });
         this.logger.info("User has been logged out", { id: req.auth.sub });

         res.clearCookie("accessToken");
         res.clearCookie("refreshToken");
         res.json({});
      } catch (err) {
         next(err);
         return;
      }
   }
}

// create a method for req , repeated code
// add logger
