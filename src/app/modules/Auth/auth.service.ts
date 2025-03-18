import status from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import bcrypt from "bcrypt";

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
  if (!(await User.isPasswordMatched(payload?.password, user.password))) {
    throw new AppError(status.FORBIDDEN, "Password did not matched");
  }
  // access Granted: send access token, refresh token

  return {};
};

export const AuthService = {
  loginUser,
};
