import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import status from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    //check if the token send from client
    if (!token) {
      throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
    }

    //check if the is valid
    jwt.verify(
      token,
      config.jwt_access_secret as string,
      function (err, decoded) {
        if (err) {
          throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
        }

        const role = (decoded as JwtPayload).role;

        if (requiredRoles && !requiredRoles.includes(role)) {
          throw new AppError(status.UNAUTHORIZED, "You are not authorized");
        }

        req.user = decoded as JwtPayload;
        next();
      }
    );
  });
};

export default auth;
