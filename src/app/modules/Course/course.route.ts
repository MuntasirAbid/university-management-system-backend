import express from "express";

import validateRequest from "../../middleware/validateRequest";
import { CourseValidations } from "./course.validation";
import { CourseControllers } from "./course.controller";

const router = express.Router();

router.post(
  "/create-course",
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse
);

router.get("/", CourseControllers.getAllCourses);

router.get("/:id", CourseControllers.getSingleCourse);
router.delete("/:id", CourseControllers.deleteCourse);

router.put(
  "/:courseId/assign-faculties",
  validateRequest(CourseValidations.assignFacultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse
);

router.patch(
  "/:id",
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse
);

export const CourseRoutes = router;
