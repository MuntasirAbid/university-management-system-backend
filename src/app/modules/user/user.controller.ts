import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "../../utlis/sendResponse";
import status from "http-status";

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, student: studentData } = req.body;

    //data validation schema using zod
    // const zodParseData = StudentValidationSchema.parse(studentData);

    const result = await userServices.createStudentIntoDB(
      password,
      studentData
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Student is created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const UserControllers = {
  createStudent,
};
