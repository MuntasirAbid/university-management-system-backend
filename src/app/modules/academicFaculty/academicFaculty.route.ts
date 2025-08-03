import express from "express";
import { academicFacultyValidation } from "./academicFaculty.validation";
import validateRequest from "../../middleware/validateRequest";
import { AcademicFacultyControllers } from "./academicFaculty.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post(
  "/create-academic-faculty",
  auth("admin", "superAdmin"),
  validateRequest(
    academicFacultyValidation.createAcademicFacultyValidationSchema
  ),
  AcademicFacultyControllers.createAcademicFaculty
);

router.get("/", AcademicFacultyControllers.getAllAcademicFaculties);

router.get("/:facultyId", AcademicFacultyControllers.getSingleAcademicFaculty);

router.patch(
  "/:facultyId",
  validateRequest(
    academicFacultyValidation.updateAcademicFacultyValidationSchema
  ),
  AcademicFacultyControllers.updateAcademicFaculty
);

export const AcademicFacultyRoutes = router;
