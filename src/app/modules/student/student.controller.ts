import { NextFunction, Request, RequestHandler, Response } from "express";
import { StudentServices } from "./student.service";
import sendResponse from "../../utlis/sendResponse";
import status from "http-status";
import catchAsync from "../../utlis/catchAsync";

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB(req.query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Student are retrieved successfully",
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res, next) => {
  const { studentId } = req.params;

  const result = await StudentServices.getSingleStudentFromDB(studentId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Student retrieved successfully",
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res, next) => {
  const { studentId } = req.params;
  const result = await StudentServices.deleteStudentFromDB(studentId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Student deleted successfully",
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res, next) => {
  const { studentId } = req.params;
  const { student } = req.body;
  const result = await StudentServices.updateStudentIntoDB(studentId, student);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Student updated successfully",
    data: result,
  });
});

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateStudent,
};
