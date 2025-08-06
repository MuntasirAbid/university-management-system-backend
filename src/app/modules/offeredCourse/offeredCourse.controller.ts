import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OfferedCourseServices } from "./offeredCourseService";
import { offeredCourseRoutes } from "./offeredCourse.route";

const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Offered course created successfully",
    data: result,
  });
});

const getAllOfferedCourses = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(
    req.query
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Offered courses retrieved successfully !",
    data: result,
  });
});

const getMyOfferedCourses = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await OfferedCourseServices.getMyOfferedCoursesFromDB(userId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Offered courses retrieved successfully !",
    data: result,
  });
});

const getSingleOfferedCourses = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = OfferedCourseServices.getSingleOfferedCourseFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Offered course fetched successfully",
    data: result,
  });
});

const updateOfferedCOurse = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await OfferedCourseServices.updateOfferedCOurseIntoDB(
    id,
    req.body
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Offered course updated successfully",
    data: result,
  });
});

export const OfferedCourseController = {
  createOfferedCourse,
  getAllOfferedCourses,
  getMyOfferedCourses,
  getSingleOfferedCourses,
  updateOfferedCOurse,
};
