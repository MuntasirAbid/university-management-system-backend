import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { offeredCOurseValidations } from "./offeredCourseValidation";
import { OfferedCourseController } from "./offeredCourse.controller";

const router = express.Router();

router.post(
  "/create-offered-course",
  validateRequest(offeredCOurseValidations.createOfferedCourseValidationSchema),
  OfferedCourseController.createOfferedCourse
);

router.get("/", OfferedCourseController.getAllOfferedCourses);

router.get("/:id", OfferedCourseController.getSingleOfferedCourses);

router.patch(
  "/:id",
  validateRequest(offeredCOurseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseController.updateOfferedCOurse
);

export const offeredCourseRoutes = router;
