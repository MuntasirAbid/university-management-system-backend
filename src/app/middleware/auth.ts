import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import status from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    //check if the token send from client
    if (!token) {
      throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
    }

    //check if the is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    const { role, userId, iat } = decoded;

    //check if the user is exist

    const user = await User.isUserExistByCustomId(userId);

    if (!user) {
      throw new AppError(status.NOT_FOUND, "This user is not found");
    }

    //check if the user is already deleted

    const isDeleted = user?.isDeleted;

    if (isDeleted) {
      throw new AppError(status.FORBIDDEN, "This user is deleted");
    }

    // //check if the usr is blocked
    const userStatus = user?.status;

    if (userStatus === "blocked") {
      throw new AppError(status.FORBIDDEN, "This user blocked!");
    }

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number
      )
    ) {
      throw new AppError(status.UNAUTHORIZED, "You are not authorized");
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(status.UNAUTHORIZED, "You are not authorized");
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
