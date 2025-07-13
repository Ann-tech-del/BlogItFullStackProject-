import { Router } from "express";
import { verifyUserInformation, checkUserNameAndPasswordReuse, verifyPasswordStrength } from "../middleware/verifyUserInformation";
import { registerUser, logInUser, logoutUser, getUserProfile, updateUserProfile, updatePassword } from "../controller/auth.controller";
import verifyUser from "../middleware/verifyUser";

const authRouter = Router()

authRouter.post(
  "/register",
  verifyUserInformation,
  checkUserNameAndPasswordReuse,
  verifyPasswordStrength,
  registerUser
);
authRouter.post("/login", logInUser)
authRouter.post("/logout", verifyUser, logoutUser)


authRouter.get("/profile", verifyUser, getUserProfile)
authRouter.put("/profile", verifyUser, updateUserProfile)
authRouter.put("/password", verifyUser, updatePassword)

export default authRouter;