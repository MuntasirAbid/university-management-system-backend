import status from "http-status";
import AppError from "../../errors/AppError";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourse } from "./offeredCourse.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { Course } from "../Course/course.model";
import { Faculty } from "../Faculty/faculty.model";
import { hasTimeConflict } from "./offeredCourse.utils";
import QueryBuilder from "../../builder/QueryBuilder";
import { Student } from "../student/student.model";

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    section,
    faculty,
    days,
    startTime,
    endTime,
  } = payload;
  //check if the semester registration id is exist
  const isSemesterRegistrationExist = await SemesterRegistration.findById(
    semesterRegistration
  );

  if (!isSemesterRegistrationExist) {
    throw new AppError(status.NOT_FOUND, "Semester registration not found");
  }

  const academicSemester = isSemesterRegistrationExist.academicSemester;

  //check if the academic faculty is exist
  const isAcademicFacultyExist = await AcademicFaculty.findById(
    academicFaculty
  );

  if (!isAcademicFacultyExist) {
    throw new AppError(status.NOT_FOUND, "Academic faculty is not found");
  }
  //check if the academic department is exist
  const isAcademicDepartmentExist = await AcademicDepartment.findById(
    academicDepartment
  );

  if (!isAcademicDepartmentExist) {
    throw new AppError(status.NOT_FOUND, "Academic department is not found");
  }

  //check if the course is exist
  const isCourseExist = await Course.findById(course);

  if (!isCourseExist) {
    throw new AppError(status.NOT_FOUND, "Course is not found");
  }

  //check if the faculty is exist
  const isFacultyExist = await Faculty.findById(faculty);

  if (!isFacultyExist) {
    throw new AppError(status.NOT_FOUND, "Faculty is not found");
  }

  //if the department is belong to the faculty
  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      status.BAD_REQUEST,
      `This ${isAcademicDepartmentExist.name} is not belong to ${isAcademicFacultyExist.name}`
    );
  }

  //check id the same course selection in same registered semester exist

  const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });

  if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      status.BAD_REQUEST,
      `Offered course with same section is already exist`
    );
  }

  //get the schedule of the faculty
  const assignedSchedule = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select("days startTime endTime");

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedule, newSchedule)) {
    throw new AppError(
      status.CONFLICT,
      "This faculty is not available at that time! Choose other time or day"
    );
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(
    OfferedCourse.find()
      .populate("semesterRegistration")
      .populate("academicSemester")
      .populate("academicFaculty")
      .populate("academicDepartment")
      .populate("course")
      .populate("faculty"),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await offeredCourseQuery.modelQuery;
  const meta = await offeredCourseQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getMyOfferedCoursesFromDB = async (userId: string) => {
  const student = await Student.findOne({ id: userId });

  if (!student) {
    throw new AppError(status.NOT_FOUND, "Student not found");
  }

  //find ongoing semester registration
  const currentOngoingRegistrationSemester = await SemesterRegistration.findOne(
    {
      status: "ONGOING",
    }
  );

  if (!currentOngoingRegistrationSemester) {
    throw new AppError(
      status.NOT_FOUND,
      "No ongoing semester registration found"
    );
  }

  const result = await OfferedCourse.aggregate([
    {
      $match: {
        semesterRegistration: currentOngoingRegistrationSemester?._id,
        academicFaculty: student.academicFaculty,
        academicDepartment: student.academicDepartment,
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: "$course",
    },
    {
      $lookup: {
        from: "enrolledcourses",
        let: {
          currentOngoingRegistrationSemester:
            currentOngoingRegistrationSemester?._id,
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      "$semesterRegistration",
                      "$$currentOngoingRegistrationSemester",
                    ],
                  },
                  {
                    $eq: ["$student", "$$currentStudent"],
                  },
                  {
                    $eq: ["$isEnrolled", true],
                  },
                ],
              },
            },
          },
        ],
        as: "enrolledCourses",
      },
    },
    {
      $lookup: {
        from: "enrolledcourses",
        let: {
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$student", "$$currentStudent"],
                  },
                  {
                    $eq: ["$isCompleted", true],
                  },
                ],
              },
            },
          },
        ],
        as: "completedCourses",
      },
    },
    {
      $addFields: {
        completedCourseIds: {
          $map: {
            input: "$completedCourses",
            as: "completed",
            in: "$$completed.course",
          },
        },
      },
    },
    {
      $addFields: {
        isPreRequisiteFullFilled: {
          $or: [
            { $eq: ["$course.preRequisiteCourses", []] },
            {
              $setIsSubset: [
                "$course.preRequisiteCourses.course",
                "$completedCourseIds",
              ],
            },
          ],
        },

        isAlreadyEnrolled: {
          $in: [
            "$course._id",
            {
              $map: {
                input: "$enrolledCourses",
                as: "enroll",
                in: "$$enroll.course",
              },
            },
          ],
        },
      },
    },
    {
      $match: {
        isAlreadyEnrolled: false,
        isPreRequisiteFullFilled: true,
      },
    },
  ]);

  return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const offeredCourse = await OfferedCourse.findById(id);

  if (!offeredCourse) {
    throw new AppError(404, "Offered Course not found");
  }

  return offeredCourse;
};

const updateOfferedCOurseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, "faculty" | "days" | "startTime" | "endTime">
) => {
  const { faculty, days, startTime, endTime } = payload;
  const isOfferedCourseExists = await OfferedCourse.findById(id);

  if (!isOfferedCourseExists) {
    throw new AppError(status.NOT_FOUND, "Offered course not found");
  }

  const isFacultyExists = await Faculty.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError(status.NOT_FOUND, "Faculty not found");
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;

  const semesterRegistrationStatus = await SemesterRegistration.findById(
    semesterRegistration
  );

  if (semesterRegistrationStatus?.status !== "UPCOMING") {
    throw new AppError(
      status.BAD_REQUEST,
      `You cannot update this registered semester as it is ${semesterRegistrationStatus?.status}`
    );
  }
  //get the schedule of faculty
  const assignedSchedule = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select("days startTime endTime");

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedule, newSchedule)) {
    throw new AppError(
      status.CONFLICT,
      "This faculty is not available at that time! Choose other time or day"
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getMyOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCOurseIntoDB,
};
