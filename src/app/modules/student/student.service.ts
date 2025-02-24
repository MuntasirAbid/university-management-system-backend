import { TStudent } from "./student.interface";
import { Student } from "./student.model";

const createStudentIntoDB = async (studentData: TStudent) => {
  // const result = await Student.create(student); //build in static method

  const student = new Student(studentData); //create an instance
  if (await student.isUserExists(studentData.id)) {
    throw new Error("User already exists");
  }

  const result = await student.save(); //build in instance method
  return result;
};

const getAllStudentsFromDB = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id }); //get data using findOne

  const result = await Student.aggregate([{ $match: { id: id } }]); //find data using aggregate

  return result;
};
const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
};
