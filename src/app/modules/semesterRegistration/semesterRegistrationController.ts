import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SemesterRegistrationService } from "./semesterRegistrationService";

const createSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationService.createSemesterRegistrationIntoDB(
      req.body
    );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Semester registration is created successfully",
    data: result,
  });
});

const getAllSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationService.getAllSemesterRegistrationFromDB(
      req.query
    );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Semester registration is retrieved successfully",
    data: result,
  });
});

const getSingleSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result =
    await SemesterRegistrationService.getSingleSemesterRegistrationFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Semester registration is retrieved successfully",
    data: result,
  });
});

const updateSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationService.updateSemesterRegistrationIntoDB(
      id,
      req.body
    );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Semester registration updated successfully",
    data: result,
  });
});

export const SemesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
};
