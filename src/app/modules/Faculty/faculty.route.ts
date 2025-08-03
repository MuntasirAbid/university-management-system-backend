import express from "express";
import { FacultyControllers } from "./faculty.controller";
import { updateFacultyValidationSchema } from "./faculty.validation";
import validateRequest from "../../middleware/validateRequest";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.const";

const router = express.Router();

router.get(
  "/:id",
  auth("admin", "superAdmin", "faculty"),
  FacultyControllers.getSingleFaculty
);

router.patch(
  "/:id",
  auth("admin", "superAdmin"),
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty
);

router.delete(
  "/:id",
  auth("admin", "superAdmin"),
  FacultyControllers.deleteFaculty
);

router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  FacultyControllers.getAllFaculties
);

export const FacultyRoutes = router;
