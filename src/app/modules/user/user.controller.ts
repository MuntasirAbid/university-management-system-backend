import { Request, Response } from "express";
import { userServices } from "./user.service";

const createStudent = async (req: Request, res: Response) => {
  try {
    const { password, student: studentData } = req.body;

    //data validation schema using zod
    // const zodParseData = StudentValidationSchema.parse(studentData);

    const result = await userServices.createStudentIntoDB(
      password,
      studentData
    );

    res.status(200).json({
      success: true,
      message: "Student is created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong!!",
      error: err,
    });
  }
};

export const UserControllers = {
  createStudent,
};
