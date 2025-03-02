import express from "express";
import { academicFacultyValidation } from "./academicFaculty.validation";
import validateRequest from "../../middleware/validateRequest";
import { AcademicFacultyControllers } from "./academicFaculty.controller";

const router = express.Router();

router.post(
  "/create-academic-semester",
  validateRequest(
    academicFacultyValidation.createAcademicFacultyValidationSchema
  ),
  AcademicFacultyControllers.createAcademicFaculty
);

router.get("/", AcademicFacultyControllers.getAllAcademicFaculties);

router.get("/:semesterId", AcademicFacultyControllers.getSingleAcademicFaculty);

router.patch(
  "/:semesterId",
  validateRequest(
    academicFacultyValidation.updateAcademicFacultyValidationSchema
  ),
  AcademicFacultyControllers.updateAcademicFaculty
);

export const AcademicFacultyRoutes = router;
