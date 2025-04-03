import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import config from "../../config";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);
  const { refreshToken, accessToken, needsPasswordChange } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User is logged in successfully!",
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthService.changePassword(req.user, passwordData);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password updated successfully!",
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Access token retrieved successfully",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const userId = req.body.id;
  const result = await AuthService.forgetPassword(userId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Forget password link generated successfully",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await AuthService.resetPassword(req.body, token as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password reset successfully",
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
