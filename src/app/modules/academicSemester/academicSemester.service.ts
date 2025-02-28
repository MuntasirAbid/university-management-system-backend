import { academicSemesterNameCodeMapper } from "./academicSemester.const";
import { TAcademicSemester } from "./academicSemester.interface";
import { academicSemesterModel } from "./academicSemester.model";

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error("Invalid Semester Code");
  }

  const result = await academicSemesterModel.create(payload);

  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
};
