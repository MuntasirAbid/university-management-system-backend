import { z } from "zod";

const createSemesterRegistrationSchema = z.object({
  body: z.object({}),
});

export const SemesterRegistrationValidations = {
  createSemesterRegistrationSchema,
};
