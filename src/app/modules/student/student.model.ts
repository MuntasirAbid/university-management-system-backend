import { Schema, model } from "mongoose";
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentMethods,
  StudentModel,
  TUserName,
} from "./student.interface";

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

const StudentSchema = new Schema<TStudent, StudentModel, StudentMethods>(
  {
    id: { type: String, required: [true, "ID is required"], unique: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "user iD is required"],
      unique: true,
      ref: "User",
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
    dateOfBirth: { type: Date },
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
    admissionSemester: { type: Schema.Types.ObjectId, ref: "AcademicSemester" },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: "AcademicDepartment",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

//virtual
StudentSchema.virtual("fullName").get(function () {
  return [this?.name?.firstName, this?.name?.middleName, this?.name?.lastName]
    .filter(Boolean) // Removes undefined values
    .join(" ");
});

//query middleware
StudentSchema.pre("findOne", function (next) {
  this.setQuery({ ...this.getQuery(), isDeleted: { $ne: true } }); // Preserve original query
  next();
});

//for creating custom static method
StudentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });

  return existingUser;
};

export const Student = model<TStudent, StudentModel>("Student", StudentSchema);
