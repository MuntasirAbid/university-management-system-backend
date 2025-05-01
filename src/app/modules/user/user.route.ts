import express from "express";
import { UserControllers } from "./user.controller";
import { StudentValidations } from "../student/student.validation";
import validateRequest from "../../middleware/validateRequest";
import { createFacultyValidationSchema } from "../Faculty/faculty.validation";
import { createAdminValidationSchema } from "../Admin/admin.validation";
import auth from "../../middleware/auth";
import { USER_ROLE } from "./user.const";
import { userValidation } from "./user.validation";

const router = express.Router();

//will call controller function
router.post(
  "/create-student",
  auth(USER_ROLE.admin),
  validateRequest(StudentValidations.CreateStudentValidationSchema),
  UserControllers.createStudent
);

router.post(
  "/create-faculty",
  auth(USER_ROLE.admin),
  validateRequest(createFacultyValidationSchema),
  UserControllers.createFaculty
);

router.post(
  "/create-admin",
  // auth(USER_ROLE.admin),
  validateRequest(createAdminValidationSchema),
  UserControllers.createAdmin
);

router.post(
  "/change-status/:id",
  auth("admin"),
  validateRequest(userValidation.changeStatusValidationSchema),
  UserControllers.changeStatus
);

router.get("/me", auth("student", "faculty", "admin"), UserControllers.getMe);

export const UserRoutes = router;
