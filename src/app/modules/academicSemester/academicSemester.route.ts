import express from "express";
import { AcademicSemesterControllers } from "./academicSemester.controller";
import validateRequest from "../../middleware/validateRequest";
import { academicSemesterValidation } from "./academicSemester.validation";

const router = express.Router();

router.post(
  "/create-academic-semester",
  validateRequest(
    academicSemesterValidation.createAcademicSemesterValidationSchema
  ),
  AcademicSemesterControllers.createAcademicSemester
);

//will call controller function
// router.get("/", StudentControllers.getAllStudents);
// router.get("/:studentId", StudentControllers.getSingleStudent);
// router.delete("/:studentId", StudentControllers.deleteStudent);

export const AcademicSemesterRoutes = router;
