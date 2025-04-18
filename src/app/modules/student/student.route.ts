import express from "express";
import { StudentControllers } from "./student.controller";
import validateRequest from "../../middleware/validateRequest";
import { StudentValidations } from "./student.validation";
import auth from "../../middleware/auth";

const router = express.Router();

//will call controller function
router.get("/", StudentControllers.getAllStudents);
router.get(
  "/:id",
  auth("admin", "faculty"),
  StudentControllers.getSingleStudent
);
router.patch(
  "/:id",
  validateRequest(StudentValidations.UpdateStudentValidationSchema),
  StudentControllers.updateStudent
);
router.delete("/:id", StudentControllers.deleteStudent);

export const StudentRoutes = router;
