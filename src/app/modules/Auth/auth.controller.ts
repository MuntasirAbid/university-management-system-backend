import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User is logged in successfully!",
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
};
