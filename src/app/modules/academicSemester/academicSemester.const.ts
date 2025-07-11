import {
  TAcademicSemesterCode,
  TAcademicSemesterCodeMapper,
  TAcademicSemesterName,
  TMonths,
} from "./academicSemester.interface";

export const months: TMonths[] = [
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

export const AcademicSemesterName: TAcademicSemesterName[] = [
  "Autumn",
  "Summer",
  "Fall",
];

export const AcademicSemesterCode: TAcademicSemesterCode[] = ["01", "02", "03"];

export const academicSemesterNameCodeMapper: TAcademicSemesterCodeMapper = {
  Autumn: "01",
  Summer: "02",
  Fall: "03",
};

export const academicSemesterSearchableFields = [
  "name",
  "year",
  "code",
  "startMonth",
  "endMonth",
];
