import { model, Schema } from "mongoose";
import {
  TAcademicSemester,
  TAcademicSemesterCode,
  TAcademicSemesterName,
  TMonths,
} from "./academicSemester.interface";
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  months,
} from "./academicSemester.const";

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: { type: String, required: true, enum: AcademicSemesterName },
    year: { type: Date, required: true },
    code: { type: String, required: true, enum: AcademicSemesterCode },
    startMonth: { type: String, enum: months, required: true },
    endMonth: { type: String, enum: months, required: true },
  },
  {
    timestamps: true,
  }
);

export const academicSemesterModel = model<TAcademicSemester>(
  "AcademicSemester",
  academicSemesterSchema
);
