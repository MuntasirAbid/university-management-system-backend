import { z } from "zod";

const userValidationSchema = z.object({
  id: z.string(),
  password: z
    .string()
    .max(20, { message: "Password cannot be more than 20 character" }),
  needsPasswordChange: z.boolean().optional().default(true),
  role: z.enum(["student", "faculty", "admin"]),
  status: z.enum(["in-progress", "blocked"]).default("in-progress"),
  isDeleted: z.boolean().optional().default(false),
});

export const userValidation = {
  userValidationSchema,
};
