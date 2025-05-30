import status from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { createToken, verifyToken } from "./auth.utils";
import { sendEmail } from "../../utils/sendEmail";

const loginUser = async (payload: TLoginUser) => {
  //check if the user is exist

  const user = await User.isUserExistByCustomId(payload.id);

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

  // //check if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(status.FORBIDDEN, "Password did not matched");
  }
  // access Granted: send access token, refresh token
  //create token and sent to the client

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  //check if the user is exist

  const user = await User.isUserExistByCustomId(userData.userId);

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

  // //check if the password is correct
  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password))) {
    throw new AppError(status.FORBIDDEN, "Password did not matched");
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round)
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    }
  );

  return null;
};

const refreshToken = async (token: string) => {
  //check if the is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userId, iat } = decoded;

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
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(status.UNAUTHORIZED, "You are not authorized");
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (userId: string) => {
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

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10m"
  );

  const resetUILink = `${config.reset_password_ui_link}?id=${user.id}&token=${resetToken}`;

  sendEmail(user.email, resetUILink);

  console.log(resetUILink);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string
) => {
  const user = await User.isUserExistByCustomId(payload?.id);

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

  //check if the is valid
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;

  if (payload.id !== decoded.userId) {
    throw new AppError(status.FORBIDDEN, "Forbidden access!");
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round)
  );

  await User.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    }
  );
};

export const AuthService = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
