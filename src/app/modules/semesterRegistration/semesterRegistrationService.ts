import status from "http-status";
import AppError from "../../errors/AppError";
import { academicSemesterModel } from "../academicSemester/academicSemester.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistration } from "./semesterRegistration.model";
import QueryBuilder from "../../builder/QueryBuilder";

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration
) => {
  const academicSemester = payload?.academicSemester;

  //check if there any registered semester that is already upcoming or on going

  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [{ status: "UPCOMING" }, { status: "ONGOING" }],
    });

  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      status.BAD_REQUEST,
      `There is already ${isThereAnyUpcomingOrOngoingSemester.status} registered semester!`
    );
  }

  //check is the semester is exist
  const isAcademicSemesterExist = await academicSemesterModel.findById(
    academicSemester
  );
  if (!isAcademicSemesterExist) {
    throw new AppError(status.NOT_FOUND, "This academic semester not found");
  }

  //check if the semester already registered
  const isSemesterRegistrationExist = await SemesterRegistration.findOne({
    academicSemester,
  });

  if (isSemesterRegistrationExist) {
    throw new AppError(status.CONFLICT, "This semester already registered");
  }

  const result = await SemesterRegistration.create(payload);

  return result;
};

const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate("academicSemester"),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;

  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);

  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>
) => {
  //check if the semester already registered
  const isSemesterRegistrationExist = await SemesterRegistration.findById(id);

  if (!isSemesterRegistrationExist) {
    throw new AppError(status.NOT_FOUND, "This semester is not found");
  }

  //if the requested semester is ended
  const requestedSemesterStatus = isSemesterRegistrationExist.status;

  if (requestedSemesterStatus === "ENDED") {
    throw new AppError(
      status.BAD_REQUEST,
      `This semester is already ${requestedSemesterStatus}`
    );
  }
};

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
};
