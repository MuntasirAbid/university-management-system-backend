import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./course.const";
import { TCourse, TCourseFaculty } from "./course.interface";
import { Course, CourseFaculty } from "./course.model";
import AppError from "../../errors/AppError";
import status from "http-status";

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);

  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate("preRequisiteCourses.course"),
    query
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await courseQuery.modelQuery;

  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    "preRequisiteCourses.course"
  );

  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    if (!updatedBasicCourseInfo) {
      throw new AppError(status.BAD_REQUEST, "Failed to update course");
    }

    //check id there is any prerequisite courses to update
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      //filter out the deleted fields
      const deletedPreRequisite = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisite } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );

      if (!deletedPreRequisiteCourses) {
        throw new AppError(status.BAD_REQUEST, "Failed to update course");
      }

      //filter out the new course fields
      const newPreRequisites = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted
      );

      const newPreRequisitesCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );

      if (!newPreRequisitesCourses) {
        throw new AppError(status.BAD_REQUEST, "Failed to update course");
      }

      const result = await Course.findById(id).populate(
        "preRequisiteCourses.course"
      );

      return result;
    }
    await session.commitTransaction();
    await session.endSession();
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(status.BAD_REQUEST, "Failed to update course");
  }
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  return result;
};

const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true,
      new: true,
    }
  );
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
  assignFacultiesWithCourseIntoDB,
};
