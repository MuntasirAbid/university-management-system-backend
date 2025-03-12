import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createSemesterRegistration = catchAsync(async (req, res) => {
  // const result =
  // sendResponse(res,{
  //  statusCode: status.OK,
  //  success: true,
  //  message: 'Semester registration is created successfully',
  //  data: result
  // })
});

const getAllSemesterRegistration = catchAsync(async (req, res) => {
  // const result =
  // sendResponse(res,{
  //  statusCode: status.OK,
  //  success: true,
  //  message: 'Semester registration is created successfully',
  //  data: result
  // })
});

const getSingleSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;

  // const result =
  // sendResponse(res,{
  //  statusCode: status.OK,
  //  success: true,
  //  message: 'Semester registration is created successfully',
  //  data: result
  // })
});

const updateSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;

  // const result =
  // sendResponse(res,{
  //  statusCode: status.OK,
  //  success: true,
  //  message: 'Semester registration is created successfully',
  //  data: result
  // })
});

export const SemesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
};
