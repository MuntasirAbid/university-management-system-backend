import express from "express";
import { AcademicSemesterControllers } from "./academicSemester.controller";
import validateRequest from "../../middleware/validateRequest";
import { academicSemesterValidation } from "./academicSemester.validation";
import auth from "../../middleware/auth";

const router = express.Router();

router.post(
  "/create-academic-semester",
  auth("admin", "superAdmin"),
  validateRequest(
    academicSemesterValidation.createAcademicSemesterValidationSchema
  ),
  AcademicSemesterControllers.createAcademicSemester
);

router.get(
  "/",
  auth("admin", "superAdmin", "student", "faculty"),
  AcademicSemesterControllers.getAllAcademicSemester
);

router.get(
  "/:semesterId",
  auth("admin", "superAdmin", "student", "faculty"),
  AcademicSemesterControllers.getSingleAcademicSemester
);

router.patch(
  "/:semesterId",
  auth("admin", "superAdmin"),
  validateRequest(
    academicSemesterValidation.updateAcademicSemesterValidationSchema
  ),
  AcademicSemesterControllers.updateAcademicSemester
);

export const AcademicSemesterRoutes = router;
