import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { EnrolledCourseServices } from "./enrolledCourse.service";

const createEnrolledCourse = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(
    userId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student is enrolled successfully",
    data: result,
  });
});

const getEnrolledCourses = catchAsync(async (req, res) => {
  const studentId = req.user.userId;

  const result = await EnrolledCourseServices.getEnrolledCourseFromDB(
    studentId,
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Enrolled courses retrieved successfully",
    meta: result.meta,
    data: result,
  });
});

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const facultyId = req.user.userId;
  const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(
    facultyId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Marks is updated successfully",
    data: result,
  });
});

export const EnrolledCourseControllers = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
  getEnrolledCourses,
};
