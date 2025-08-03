import express from "express";
import { academicDepartmentValidation } from "./academicDepartment.validation";
import validateRequest from "../../middleware/validateRequest";
import { AcademicDepartmentControllers } from "./academicDepartment.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post(
  "/create-academic-department",
  auth("admin", "superAdmin"),
  validateRequest(
    academicDepartmentValidation.createAcademicDepartmentValidationSchema
  ),
  AcademicDepartmentControllers.createAcademicDepartment
);

router.get("/", AcademicDepartmentControllers.getAllAcademicDepartments);

router.get(
  "/:departmentId",
  AcademicDepartmentControllers.getSingleAcademicDepartment
);

router.patch(
  "/:departmentId",
  validateRequest(
    academicDepartmentValidation.updateAcademicDepartmentValidationSchema
  ),
  AcademicDepartmentControllers.updateAcademicDepartment
);

export const AcademicDepartmentRoutes = router;
