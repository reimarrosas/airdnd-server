import express from "express";

import {
  checkIfLoggedIn,
  login,
  logout,
  recover,
  sendRecovery,
} from "../controllers/login.controller";
import { signup, verifyEmail } from "../controllers/signup.controller";

const router = express.Router();

router.post("/login", login);
router.post("/recovery/send", sendRecovery);
router.post("/recovery", recover);
router.post("/logout", logout);
router.post("/signup", signup);
router.patch("/verify", verifyEmail);
router.post("/status", checkIfLoggedIn, (req, res, _next) => {
  const response: HttpResponseMessage = {
    message: "User is logged in",
    success: true,
  };
  response["user"] = req.session.user;
  res.send(response);
});

export default router;
