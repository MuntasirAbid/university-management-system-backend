import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { EnrolledCourseControllers } from "./enrolledCourse.controller";
import auth from "../../middleware/auth";
import { EnrolledCourseValidations } from "./enrolledCourse.validation";

const router = express.Router();

router.post(
  "/create-enrolled-course",
  auth("student"),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema
  ),
  EnrolledCourseControllers.createEnrolledCourse
);

router.get(
  "/get-enrolled-courses",
  auth("student"),
  EnrolledCourseControllers.getEnrolledCourses
);

router.patch(
  "/update-enrolled-course-marks",
  auth("faculty"),
  validateRequest(
    EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema
  ),
  EnrolledCourseControllers.updateEnrolledCourseMarks
);

export const EnrolledCourseRoutes = router;
