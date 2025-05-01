import { z } from "zod";
import { UserStatus } from "./user.const";

const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: "Password must be string" })
    .max(20, { message: "Password cannot be more than 20 character" })
    .optional(),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});

export const userValidation = {
  userValidationSchema,
  changeStatusValidationSchema,
};
