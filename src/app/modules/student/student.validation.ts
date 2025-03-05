import { z } from "zod";

const createUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .max(20, "First name cannot be more than 20 characters")
    .regex(/^[A-Z][a-z]*$/, 'First name must be capitalized (e.g., "John")'),
  middleName: z.string().optional(),
  lastName: z.string().nonempty("Last name is required"),
});

// Guardian Schema
const createGuardianValidationSchema = z.object({
  fatherName: z.string().nonempty("Father's name is required"),
  fatherOccupation: z.string().nonempty("Father's occupation is required"),
  fatherContactNo: z.string().nonempty("Father's contact number is required"),
  motherName: z.string().nonempty("Mother's name is required"),
  motherOccupation: z.string().nonempty("Mother's occupation is required"),
  motherContactNo: z.string().nonempty("Mother's contact number is required"),
});

// Local Guardian Schema
const createLocalGuardianValidationSchema = z.object({
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
      name: createUserNameValidationSchema,
      gender: z.enum(["male", "female", "other"]),
      dateOfBirth: z.string().optional(),
      email: z.string().email("Invalid email format"),
      contactNo: z.string().nonempty("Contact number is required"),
      emergencyContactNo: z
        .string()
        .nonempty("Emergency contact number is required"),
      bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
      presentAddress: z.string().nonempty("Present address is required"),
      permanentAddress: z.string().nonempty("Permanent address is required"),
      guardian: createGuardianValidationSchema,
      localGuardian: createLocalGuardianValidationSchema,
      admissionSemester: z.string(),
      academicDepartment: z.string(),
      profileImage: z.string().optional(),
    }),
  }),
});

const updateUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .max(20, "First name cannot be more than 20 characters")
    .regex(/^[A-Z][a-z]*$/, 'First name must be capitalized (e.g., "John")')
    .optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
});

// Guardian Schema
const updateGuardianValidationSchema = z.object({
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherContactNo: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherContactNo: z.string().optional(),
});

// Local Guardian Schema
const updateLocalGuardianValidationSchema = z.object({
  name: z.string().optional(),
  occupation: z.string().optional(),
  contactNo: z.string().optional(),
  address: z.string().optional(),
});

// Student Schema
const UpdateStudentValidationSchema = z.object({
  body: z
    .object({
      student: z
        .object({
          name: updateUserNameValidationSchema.optional(),
          gender: z.enum(["male", "female", "other"]).optional(),
          dateOfBirth: z.string().optional(),
          email: z.string().email("Invalid email format").optional(),
          contactNo: z.string().optional(),
          emergencyContactNo: z.string().optional(),
          bloodGroup: z
            .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
            .optional(),
          presentAddress: z.string().optional(),
          permanentAddress: z.string().optional(),
          guardian: updateGuardianValidationSchema.optional(),
          localGuardian: updateLocalGuardianValidationSchema.optional(),
          admissionSemester: z.string().optional(),
          academicDepartment: z.string().optional(),
          profileImage: z.string().optional(),
        })
        .partial(),
    })
    .partial(),
});

export const StudentValidations = {
  CreateStudentValidationSchema,
  UpdateStudentValidationSchema,
};
