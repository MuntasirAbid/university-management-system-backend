import { model, Schema } from "mongoose";
import {
  TAcademicSemester,
  TAcademicSemesterCode,
  TAcademicSemesterName,
  TMonths,
} from "./academicSemester.interface";

const months: TMonths[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const AcademicSemesterName: TAcademicSemesterName[] = [
  "Autumn",
  "Summer",
  "Fall",
];

const AcademicSemesterCode: TAcademicSemesterCode[] = ["01", "02", "03"];

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: { type: String, required: true },
    year: { type: Date, required: true },
    code: { type: String, required: true },
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
