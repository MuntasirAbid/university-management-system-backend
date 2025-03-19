import express from "express";
import { FacultyControllers } from "./faculty.controller";
import { updateFacultyValidationSchema } from "./faculty.validation";
import validateRequest from "../../middleware/validateRequest";
import auth from "../../middleware/auth";

const router = express.Router();

router.get("/:id", FacultyControllers.getSingleFaculty);

router.patch(
  "/:id",
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty
);

router.delete("/:id", FacultyControllers.deleteFaculty);

router.get("/", auth(), FacultyControllers.getAllFaculties);

export const FacultyRoutes = router;
