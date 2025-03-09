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

// router.patch(
//   "/:facultyId",
//   validateRequest(
//     academicFacultyValidation.updateAcademicFacultyValidationSchema
//   ),
//   AcademicFacultyControllers.updateAcademicFaculty
// );

export const CourseRoutes = router;
