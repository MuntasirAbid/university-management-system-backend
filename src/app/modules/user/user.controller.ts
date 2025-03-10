import { userServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import catchAsync from "../../utils/catchAsync";

const createStudent = catchAsync(async (req, res, next) => {
  const { password, student: studentData } = req.body;

  const result = await userServices.createStudentIntoDB(password, studentData);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Student is created successfully",
    data: result,
  });
});

export const UserControllers = {
  createStudent,
};
