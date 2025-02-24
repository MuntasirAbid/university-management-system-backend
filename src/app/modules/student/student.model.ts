import { Schema, model } from "mongoose";
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentMethods,
  StudentModel,
  TUserName,
} from "./student.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const UserNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    maxlength: [20, "First name cannot be more then 20 character"],
    validate: {
      validator: function (value: string) {
        return /^[A-Z][a-z]*$/.test(value); // Ensures first letter is uppercase, rest are lowercase
      },
      message: '{VALUE} is not properly capitalized (e.g., "John")',
    },
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, "Last name is required"],
  },
});

const GuardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: true,
    trim: true,
  },
  fatherOccupation: {
    type: String,
    required: true,
    trim: true,
  },
  fatherContactNo: {
    type: String,
    required: true,
    trim: true,
  },
  motherName: {
    type: String,
    required: true,
    trim: true,
  },
  motherOccupation: {
    type: String,
    required: true,
  },
  motherContactNo: {
    type: String,
    required: true,
  },
});

const LocalGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const StudentSchema = new Schema<TStudent, StudentModel, StudentMethods>({
  id: { type: String, required: [true, "ID is required"], unique: true },
  password: {
    type: String,
    required: [true, "Password is required"],
    maxlength: [20, "Password cannot be more than 20 character"],
  },
  name: {
    type: UserNameSchema,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
    message:
      "The gender field can only be one of the following 'male','female','other'",
  },
  dateOfBirth: { type: String },
  email: { type: String, required: true, unique: true },
  contactNo: { type: String, required: true },
  emergencyContactNo: { type: String, required: true },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    message: "{VALUE} is not valid",
  },
  presentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  guardian: {
    type: GuardianSchema,
    required: true,
  },
  localGuardian: {
    type: LocalGuardianSchema,
    required: true,
  },
  profileImage: { type: String },
  isActive: {
    type: String,
    enum: ["active", "blocked"],
    default: "active",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

//pre save middleware/hook : will work on save() create()
StudentSchema.pre("save", async function (next) {
  // console.log(this, "pre hook: we will save the data");
  const user = this;
  //hashing password and saving to DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round)
  );
  next();
});

//post save middleware/ hook
StudentSchema.post("save", function (doc, next) {
  doc.password = "";

  next();
});

//query middleware
StudentSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
StudentSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

//for creating custom interface method
StudentSchema.methods.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });

  return existingUser;
};

export const Student = model<TStudent, StudentModel>("Student", StudentSchema);
