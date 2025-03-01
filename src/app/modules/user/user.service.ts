import config from "../../config";
import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { academicSemesterModel } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateStudentId } from "./user.utills";

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  //create a user object
  const userData: Partial<TUser> = {};

  //if password is not given, use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = "student";

  //find academic semester info
  const admissionSemester = await academicSemesterModel.findById(
    payload.admissionSemester
  );

  // Check if semester exists
  if (!admissionSemester) {
    throw new Error("Invalid admission semester provided");
  }

  //set generated id
  userData.id = await generateStudentId(admissionSemester);

  //create a user
  const newUser = await User.create(userData);

  //create a student
  if (Object.keys(newUser).length) {
    //set id, _id as user
    payload.id = newUser.id;
    payload.user = newUser._id; //reference id

    const newStudent = await Student.create(payload);
  }
  return newUser;
};

export const userServices = {
  createStudentIntoDB,
};
