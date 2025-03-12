import mongoose, { Schema } from "mongoose";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistrationStatus } from "./semesterRegistration.const";
import { timeStamp } from "console";

const semesterRegistrationSchema = new mongoose.Schema<TSemesterRegistration>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: "AcademicSemester",
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: SemesterRegistrationStatus,
      default: "UPCOMING",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    minCredit: {
      type: Number,
      default: 3,
    },
    maxCredit: {
      type: Number,
      default: 15,
    },
  },
  { timestamps: true }
);

export const SemesterRegistration = mongoose.model<TSemesterRegistration>(
  "semesterRegistration",
  semesterRegistrationSchema
);
