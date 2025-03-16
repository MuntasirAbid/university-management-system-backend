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
    section,
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

  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
};
