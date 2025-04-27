import { string } from "zod";
import config from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";

export const createToken = (
  jwtPayload: { userId: string; role: string },
  secret: string,
  expiresIn: string
): string => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
