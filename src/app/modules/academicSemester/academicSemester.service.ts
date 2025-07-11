import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import {
  academicSemesterNameCodeMapper,
  academicSemesterSearchableFields,
} from "./academicSemester.const";
import { TAcademicSemester } from "./academicSemester.interface";
import { academicSemesterModel } from "./academicSemester.model";

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(404, "Invalid Semester Code");
  }

  const result = await academicSemesterModel.create(payload);

  return result;
};

const getAllAcademicSemesterFromDB = async (query: Record<string, unknown>) => {
  const academicSemesterQuery = new QueryBuilder(
    academicSemesterModel.find(),
    query
  )
    .search(academicSemesterSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await academicSemesterQuery.modelQuery;

  // Total number of documents matching the filter (before pagination)
  const total = await academicSemesterModel.countDocuments(
    academicSemesterQuery.modelQuery.getFilter()
  );

  const pagination = academicSemesterQuery.getPaginationInfo();

  return {
    meta: {
      total,
      page: pagination?.page || 1,
      limit: pagination?.limit || 10,
    },
    data: result,
  };
};

const getSingleAcademicSemesterFromDB = async (id: string) => {
  const result = await academicSemesterModel.findById(id);
  return result;
};

const updateAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new AppError(404, "Invalid semester code");
  }

  const result = await academicSemesterModel.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    }
  );
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemesterFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterIntoDB,
};
