import { z } from "zod";
import { idParamSchema } from "./common.js";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

export const verifyEmailOtpSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Invalid email format"),
    otp: z.string().trim().min(1, "OTP is required"),
  }),
});

export const resendOtpSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Invalid email format"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const updatePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters long"),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Invalid email format"),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Invalid email format"),
    otp: z.string().trim().min(1, "OTP is required"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Invalid email format"),
    newPassword: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters long"),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password must be the same.",
    path: ["confirmPassword"],
  }),
});

export const updateUserDetailsSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name cannot be empty").optional(),
    email: z.string().trim().email("Invalid email format").optional(),
    mobile: z.string().trim().optional(),
    password: z.string().min(6, "Password must be at least 6 characters long").optional(),
  }),
});

export const adminUpdateUserRoleSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Invalid email format"),
    role: z.enum(["USER", "ADMIN", "MANAGER"], {
      errorMap: () => ({ message: "Invalid role. Role must be either 'USER', 'MANAGER', or 'ADMIN'." }),
    }),
  }),
});

export const adminUpdateUserStatusSchema = z.object({
  params: idParamSchema.shape.params,
  body: z.object({
    status: z.enum(["Active", "Warning", "Suspended"], {
      errorMap: () => ({ message: "Invalid status provided" }),
    }),
  }),
});
