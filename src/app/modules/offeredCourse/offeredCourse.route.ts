import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { offeredCOurseValidations } from "./offeredCourseValidation";
import { OfferedCourseController } from "./offeredCourse.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post(
  "/create-offered-course",
  auth("admin", "superAdmin"),
  validateRequest(offeredCOurseValidations.createOfferedCourseValidationSchema),
  OfferedCourseController.createOfferedCourse
);

router.get(
  "/",
  auth("admin", "superAdmin", "faculty"),
  OfferedCourseController.getAllOfferedCourses
);

router.get(
  "/my-offered-courses",
  auth("student"),
  OfferedCourseController.getMyOfferedCourses
);

router.get(
  "/:id",
  auth("admin", "superAdmin", "faculty", "student"),
  OfferedCourseController.getSingleOfferedCourses
);

router.patch(
  "/:id",
  auth("admin", "superAdmin"),
  validateRequest(offeredCOurseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseController.updateOfferedCOurse
);

export const offeredCourseRoutes = router;
