import { RequestHandler } from "express";
import argon2 from "argon2";
import { nanoid } from "nanoid";

import { changeUserPass, getUser } from "../services/user.services";
import {
  isEmailValid,
  isLoginCredsValid,
  isRecoveryValid,
} from "../utilities/authValidator";
import { generateHttpError } from "../utilities/httpErrors";
import { hashingSettings, threeYears } from "../utilities/constants";
import { sendEmail } from "../utilities/sendEmail";
import {
  createVerification,
  deleteVerification,
} from "../services/verification.services";

export const extractUserSession = ({
  id,
  fullName,
  email,
  type,
}: UserEntity): UserSession => ({
  id,
  fullName,
  email,
  type,
});

export const login: RequestHandler = async (req, res, _next) => {
  const { email, password, type } = isLoginCredsValid(req.body);
  const { keep } = req.query;

  const user = await getUser({ email, type });

  if (!user || !(await argon2.verify(user.password, password))) {
    throw generateHttpError("Conflict");
  } else if (!user.isVerified) {
    throw generateHttpError("Forbidden");
  }

  const response: HttpResponseMessage = {
    success: true,
    message: "User login successful",
  };

  response["user"] = extractUserSession(user);
  req.session.user = response["user"];
  req.session.cookie.maxAge = keep === "true" ? threeYears : undefined;

  res.send(response);
};

export const sendRecovery: RequestHandler = async (req, res, _next) => {
  const { email } = req.body;

  if (typeof email !== "string" || !isEmailValid(email)) {
    throw generateHttpError("Bad Request");
  }

  const user = await getUser({ email });

  if (user) {
    const id = nanoid();
    createVerification({ id, userId: user.id });
    sendEmail({
      to: user.email,
      subject: "Password Recovery",
      content: `This is your recovery code: ${id}`,
    });
  }

  const response: HttpResponseMessage = {
    message: "Recovery processing successful",
    success: true,
  };

  res.status(201).send(response);
};

export const recover: RequestHandler = async (req, res, _next) => {
  const { password } = req.body;
  const { id } = req.query;

  const recov = isRecoveryValid({ password, id });

  const verification = await deleteVerification(recov.id);

  if (!verification) {
    throw generateHttpError("Conflict");
  }

  const hashed = await argon2.hash(password, hashingSettings);
  const user = await changeUserPass(verification.userId, hashed);

  if (!user) {
    throw generateHttpError("Internal");
  }

  const response: HttpResponseMessage = {
    message: "Password recovery successful",
    success: true,
  };

  res.send(response);
};

export const logout: RequestHandler = (req, res, _next) => {
  req.session.destroy(() => {});
  const response: HttpResponseMessage = {
    message: "Logout successful",
    success: true,
  };
  res.send(response);
};

export const checkIfLoggedIn: RequestHandler = (req, _res, next) => {
  if (!req.session.user) throw generateHttpError("Unauthorized");
  return next();
};

export const checkIfAuthorized =
  (type: UserType): RequestHandler =>
  (req, _res, next) => {
    if (type !== req.session.user.type) throw generateHttpError("Forbidden");
    return next();
  };
