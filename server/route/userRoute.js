import express from "express";
import {
  deleteUser,
  forgotPassword,
  getAllUsers,
  getSingleUser,
  getUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  resendOtp,
  resetPassword,
  updatePassword,
  updateUserDetails,
  updateUserRole,
  updateUserStatus,
  uploadAvatar,
  verifyEmailOtp,
  verifyOtp,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import admin from "../middleware/Admin.js";
import { validate } from "../middleware/validate.js";
import {
  registerSchema,
  verifyEmailOtpSchema,
  resendOtpSchema,
  loginSchema,
  updatePasswordSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
  updateUserDetailsSchema,
  adminUpdateUserRoleSchema,
  adminUpdateUserStatusSchema,
} from "../validators/userSchemas.js";
import { idParamSchema } from "../validators/common.js";

const userRouter = express.Router();

userRouter.post("/register", validate(registerSchema), registerUser);

userRouter.post("/verify-email", validate(verifyEmailOtpSchema), verifyEmailOtp);

userRouter.post("/resend-otp", validate(resendOtpSchema), resendOtp);

userRouter.post("/login", validate(loginSchema), loginUser);

userRouter.get("/logout", logoutUser);

userRouter.put("/upload-avatar", upload.single("avatar"), auth, uploadAvatar);

userRouter.put("/update/password", auth, validate(updatePasswordSchema), updatePassword);

userRouter.put("/forgot-password", validate(forgotPasswordSchema), forgotPassword);

userRouter.put("/verify-otp", validate(verifyOtpSchema), verifyOtp);

userRouter.put("/reset-password", validate(resetPasswordSchema), resetPassword);

userRouter.get("/me", auth, getUserDetails);

userRouter.put(
  "/update-user",
  auth,
  upload.single("avatar"),
  validate(updateUserDetailsSchema),
  updateUserDetails
);

userRouter.get("/admin/get", auth, admin, getAllUsers);

userRouter.get("/admin/get/:id", auth, admin, validate(idParamSchema), getSingleUser);

userRouter.put("/admin/update", auth, admin, validate(adminUpdateUserRoleSchema), updateUserRole);

userRouter.delete("/admin/delete/:id", auth, admin, validate(idParamSchema), deleteUser);

userRouter.patch("/admin/:id/status", auth, admin, validate(adminUpdateUserStatusSchema), updateUserStatus);

export default userRouter;
