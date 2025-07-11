import mongoose, { Error } from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import { academicSemesterModel } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import status from "http-status";
import { TFaculty } from "../Faculty/faculty.interface";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Faculty } from "../Faculty/faculty.model";
import { Admin } from "../Admin/admin.model";
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from "./user.utils";
import { verifyToken } from "../Auth/auth.utils";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { TAdmin } from "../Admin/admin.interface";

const createStudentIntoDB = async (
  file: any,
  password: string,
  payload: TStudent
) => {
  //create a user object
  const userData: Partial<TUser> = {};

  //if password is not given, use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = "student";
  userData.email = payload.email;

  //find academic semester info
  const admissionSemester = await academicSemesterModel.findById(
    payload.admissionSemester
  );

  // Check if semester exists
  if (!admissionSemester) {
    throw new AppError(404, "Invalid admission semester provided");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set generated id
    userData.id = await generateStudentId(admissionSemester);

    const imageName = `${userData.id}${payload?.name?.firstName}`;
    const path = file?.path;
    //send image to cloudinary
    const { secure_url } = await sendImageToCloudinary(imageName, path);

    //create a user (transaction -1)
    const newUser = await User.create([userData], { session });

    //set id, _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference id
    payload.profileImage = secure_url;

    //create a student (transaction -2)
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError(status.BAD_REQUEST, "Failed to create student");
    }

    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = "faculty";
  userData.email = payload.email;

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment
  );

  if (!academicDepartment) {
    throw new AppError(400, "Academic department not found");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(status.BAD_REQUEST, "Failed to create user");
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(status.BAD_REQUEST, "Failed to create faculty");
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TAdmin
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = "admin";
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    const imageName = `${userData.id}${payload?.name?.firstName}`;
    const path = file?.path;
    const { secure_url } = await sendImageToCloudinary(imageName, path);

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(status.BAD_REQUEST, "Failed to create admin");
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id
    payload.profileImage = secure_url;

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(status.BAD_REQUEST, "Failed to create admin");
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const getMe = async (userId: string, role: string) => {
  // const decoded = verifyToken(token, config.jwt_access_secret as string);
  // const { userId, role } = decoded;

  let result = null;

  if (role === "student") {
    result = await Student.findOne({ id: userId }).populate("user");
  }
  if (role === "admin") {
    result = await Admin.findOne({ id: userId }).populate("user");
  }
  if (role === "faculty") {
    result = await Faculty.findOne({ id: userId }).populate("user");
  }

  return result;
};

export const userServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus,
};
