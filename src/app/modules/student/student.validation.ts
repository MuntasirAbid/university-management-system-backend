import { z } from "zod";

const UserNameValidationSchema = z.object({
  firstName: z
    .string()
    .max(20, "First name cannot be more than 20 characters")
    .regex(/^[A-Z][a-z]*$/, 'First name must be capitalized (e.g., "John")'),
  middleName: z.string().optional(),
  lastName: z.string().nonempty("Last name is required"),
});

// Guardian Schema
const GuardianValidationSchema = z.object({
  fatherName: z.string().nonempty("Father's name is required"),
  fatherOccupation: z.string().nonempty("Father's occupation is required"),
  fatherContactNo: z.string().nonempty("Father's contact number is required"),
  motherName: z.string().nonempty("Mother's name is required"),
  motherOccupation: z.string().nonempty("Mother's occupation is required"),
  motherContactNo: z.string().nonempty("Mother's contact number is required"),
});

// Local Guardian Schema
const LocalGuardianValidationSchema = z.object({
  name: z.string().nonempty("Local guardian's name is required"),
  occupation: z.string().nonempty("Local guardian's occupation is required"),
  contactNo: z.string().nonempty("Local guardian's contact number is required"),
  address: z.string().nonempty("Local guardian's address is required"),
});

// Student Schema
const CreateStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    student: z.object({
      name: UserNameValidationSchema,
      gender: z.enum(["male", "female", "other"]),
      dateOfBirth: z.date().optional(),
      email: z.string().email("Invalid email format"),
      contactNo: z.string().nonempty("Contact number is required"),
      emergencyContactNo: z
        .string()
        .nonempty("Emergency contact number is required"),
      bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
      presentAddress: z.string().nonempty("Present address is required"),
      permanentAddress: z.string().nonempty("Permanent address is required"),
      guardian: GuardianValidationSchema,
      localGuardian: LocalGuardianValidationSchema,
      admissionSemester: z.string(),
      profileImage: z.string().optional(),
    }),
  }),
});

export const StudentValidations = {
  StudentValidationSchema: CreateStudentValidationSchema,
};
