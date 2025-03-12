import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { SemesterRegistrationValidations } from "./semesterRegistrationValidation";
import { SemesterRegistrationControllers } from "./semesterRegistrationController";

const router = express.Router();

router.post(
  "/create-semester-registration",
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationSchema
  ),
  SemesterRegistrationControllers.createSemesterRegistration
);

router.get(
  "/:id",
  SemesterRegistrationControllers.getSingleSemesterRegistration
);

router.patch(
  "/:id",
  SemesterRegistrationControllers.updateSemesterRegistration
);

router.get("/", SemesterRegistrationControllers.getAllSemesterRegistration);

export const semesterRegistrationRoutes = router;
