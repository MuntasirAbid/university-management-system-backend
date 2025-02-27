import { z } from "zod";
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  months,
} from "./academicSemester.const";

const createAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z.enum([...AcademicSemesterName] as [string, ...string[]]),
    year: z.string(),
    code: z.enum([...AcademicSemesterCode] as [string, ...string[]]),
    startMonth: z.enum([...months] as [string, ...string[]]),
    endMonth: z.enum([...months] as [string, ...string[]]),
  }),
});

export const academicSemesterValidation = {
  createAcademicSemesterValidationSchema,
};
