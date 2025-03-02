import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "../../utlis/sendResponse";
import status from "http-status";
import catchAsync from "../../utlis/catchAsync";
import { AcademicFacultyServices } from "./academicFaculty.service";

const createAcademicFaculty = catchAsync(async (req, res) => {
  // const { password, student: studentData } = req.body;

  const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(
    req.body
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Academic faculty is created successfully",
    data: result,
  });
});

const getAllAcademicFaculties = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.getAllAcademicFacultiesFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "All academic faculties retrieved successfully",
    data: result,
  });
});

const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await AcademicFacultyServices.getSingleAcademicFacultyFromDB(
    facultyId
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Academic faculty is retrieved successfully",
    data: result,
  });
});

const updateAcademicFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await AcademicFacultyServices.updateAcademicFacultyIntoDB(
    facultyId,
    req.body
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Academic faculty updated successfully",
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
};
