import mongoose from "mongoose";
import { TStudent } from "./student.interface";
import { Student } from "./student.model";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import status from "http-status";

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  console.log("base query", query);

  const queryObj = { ...query };

  const studentSearchableFields = ["email", "name.firstName", "presentAddress"];
  let searchTerm = "";

  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }

  const searchQuery = Student.find({
    $or: studentSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  });

  //Filtering
  const excludeFields = ["searchTerm", "sort", "limit"];

  excludeFields.forEach((el) => delete queryObj[el]);

  let filterQuery = searchQuery
    .find(queryObj)
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });

  let sort = "-createdAt";

  if (query.sort) {
    sort = query.sort as string;
  }

  filterQuery = filterQuery.sort(sort);

  // ✅ Convert limit to a number (Default: 10)
  let limit = 1; // Default value
  if (query.limit) {
    limit = Number(query.limit); // Ensure it's a number
  }

  // ✅ Apply limit correctly
  filterQuery = filterQuery.limit(limit);

  return await filterQuery;
};

const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.aggregate([{ $match: { id } }]);

  const result = await Student.findOne({ id })
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });

  return result;
};
const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  // const result = await Student.aggregate([{ $match: { id } }]);

  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if user exists
    const existingUser = await User.findOne({ id });
    if (!existingUser) {
      throw new AppError(status.NOT_FOUND, "User does not exist");
    }

    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedStudent) {
      throw new AppError(status.BAD_REQUEST, "Failed to delete student");
    }

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );
    if (!deletedUser) {
      throw new AppError(status.BAD_REQUEST, "Failed to delete student");
    }
    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error("Failed to delete student");
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
