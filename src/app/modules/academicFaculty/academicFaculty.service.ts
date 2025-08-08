import QueryBuilder from "../../builder/QueryBuilder";
import { AcademicFacultySearchableFields } from "./academicFaculty.const";
import { AcademicFaculty } from "./academicFaculty.model";
import { TAcademicFaculty } from "./academicFeculty.interface";

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  const result = await AcademicFaculty.create(payload);

  return result;
};

const getAllAcademicFacultiesFromDB = async (
  query: Record<string, unknown>
) => {
  const academicFacultyModelQuery = new QueryBuilder(
    AcademicFaculty.find(),
    query
  )
    .search(AcademicFacultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await academicFacultyModelQuery.countTotal();
  const result = await academicFacultyModelQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingleAcademicFacultyFromDB = async (id: string) => {
  const result = await AcademicFaculty.findById(id);
  return result;
};

const updateAcademicFacultyIntoDB = async (
  id: string,
  payload: Partial<TAcademicFaculty>
) => {
  const result = await AcademicFaculty.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const AcademicFacultyServices = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultiesFromDB,
  getSingleAcademicFacultyFromDB,
  updateAcademicFacultyIntoDB,
};
