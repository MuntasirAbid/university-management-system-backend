import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { SemesterRegistrationValidations } from "./semesterRegistrationValidation";
import { SemesterRegistrationControllers } from "./semesterRegistrationController";
import auth from "../../middleware/auth";

const router = express.Router();

router.post(
  "/create-semester-registration",
  auth("admin", "superAdmin"),
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationSchema
  ),
  SemesterRegistrationControllers.createSemesterRegistration
);

router.get(
  "/:id",
  auth("admin", "superAdmin", "student", "faculty"),
  SemesterRegistrationControllers.getSingleSemesterRegistration
);

router.patch(
  "/:id",
  auth("admin", "superAdmin"),
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationSchema
  ),
  SemesterRegistrationControllers.updateSemesterRegistration
);

router.delete(
  "/:id",
  auth("admin", "superAdmin"),
  SemesterRegistrationControllers.deleteSemesterRegistration
);

router.get(
  "/",
  auth("admin", "superAdmin", "student", "faculty"),
  SemesterRegistrationControllers.getAllSemesterRegistration
);

export const semesterRegistrationRoutes = router;
