import express from "express";
import { StudentControllers } from "./student.controller";
import validateRequest from "../../middleware/validateRequest";
import { StudentValidations } from "./student.validation";
import auth from "../../middleware/auth";

const router = express.Router();

//will call controller function
router.get("/", auth("admin", "superAdmin"), StudentControllers.getAllStudents);
router.get(
  "/:id",
  auth("admin", "faculty", "superAdmin"),
  StudentControllers.getSingleStudent
);
router.patch(
  "/:id",
  auth("admin", "superAdmin"),
  validateRequest(StudentValidations.UpdateStudentValidationSchema),
  StudentControllers.updateStudent
);
router.delete(
  "/:id",
  auth("admin", "superAdmin"),
  StudentControllers.deleteStudent
);

export const StudentRoutes = router;
