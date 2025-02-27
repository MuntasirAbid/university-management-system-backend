import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import { StudentValidations } from "../student/student.validation";
import validateRequest from "../../middleware/validateRequest";

const router = express.Router();

//will call controller function
router.post(
  "/create-student",
  validateRequest(StudentValidations.StudentValidationSchema),
  UserControllers.createStudent
);

export const UserRoutes = router;
