import status from "http-status";
import AppError from "../../errors/AppError";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourse } from "./offeredCourse.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { Course } from "../Course/course.model";
import { Faculty } from "../Faculty/faculty.model";

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
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

  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
};
