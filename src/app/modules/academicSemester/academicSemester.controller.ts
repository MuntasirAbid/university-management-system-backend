import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AcademicSemesterServices } from "./academicSemester.service";

const createAcademicSemester = catchAsync(async (req, res) => {
  // const { password, student: studentData } = req.body;

  const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
    req.body
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Academic semester is created successfully",
    data: result,
  });
});

const getAllAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getAllAcademicSemesterFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "All academic semesters retrieved successfully",
    data: result,
  });
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result = await AcademicSemesterServices.getSingleAcademicSemesterFromDB(
    semesterId
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Academic semester is retrieved successfully",
    data: result,
  });
});

const updateAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(
    semesterId,
    req.body
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Academic semester updated successfully",
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
