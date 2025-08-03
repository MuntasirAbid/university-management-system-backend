import express from "express";

import validateRequest from "../../middleware/validateRequest";
import { CourseValidations } from "./course.validation";
import { CourseControllers } from "./course.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post(
  "/create-course",
  auth("admin", "superAdmin"),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse
);

router.get(
  "/",
  auth("admin", "faculty", "student", "superAdmin"),
  CourseControllers.getAllCourses
);

router.get(
  "/:id",
  auth("admin", "faculty", "student", "superAdmin"),
  CourseControllers.getSingleCourse
);

router.delete(
  "/:id",
  auth("admin", "superAdmin"),
  CourseControllers.deleteCourse
);

router.patch(
  "/:id",
  auth("admin", "superAdmin"),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse
);

router.put(
  "/:courseId/assign-faculties",
  auth("admin", "superAdmin"),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse
);

router.get(
  "/:courseId/get-faculties",
  auth("admin", "superAdmin", "faculty", "student"),

  CourseControllers.getFacultiesWithCourse
);

router.delete(
  "/:courseId/remove-faculties",
  auth("admin", "superAdmin"),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourse
);

export const CourseRoutes = router;
