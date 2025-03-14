import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { offeredCOurseValidations } from "./offeredCourseValidation";
import { OfferedCourseController } from "./offeredCourse.controller";

const router = express.Router();

// router.get("/", OfferedCourseController.getAllOfferedCourse);

// router.get("/:id", OfferedCourseController.getSingleOfferedCourse);

router.post(
  "/create-offered-course",
  validateRequest(offeredCOurseValidations.createOfferedCourseValidationSchema),
  OfferedCourseController.createOfferedCourse
);

// router.patch(
//   "/:id",
//   validateRequest(offeredCOurseValidations.updateOfferedCourseValidationSchema),
//   OfferedCourseController.updateOfferedCourse
// );

export const offeredCourseRoutes = router;
