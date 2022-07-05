import { RequestHandler } from "express";
import argon2 from "argon2";
import { nanoid } from "nanoid";

import { createUser, getUser, verifyUser } from "../services/user.services";
import { isSignupCredsValid } from "../utilities/authValidator";
import { generateHttpError } from "../utilities/httpErrors";
import {
  createVerification,
  deleteVerification,
} from "../services/verification.services";
import { sendEmail } from "../utilities/sendEmail";
import { clientUrl, hashingSettings } from "../utilities/constants";

export const signup: RequestHandler = async (req, res, _next) => {
  const signupCreds = isSignupCredsValid(req.body);

  const userInDb = await getUser({
    email: signupCreds.email,
    type: signupCreds.type,
  });

  if (userInDb) {
    throw generateHttpError("Conflict");
  }

  const hashed = await argon2.hash(signupCreds.password, hashingSettings);

  const createdUser = await createUser({ ...signupCreds, password: hashed });

  if (!createdUser) throw generateHttpError("Internal");

  const verificationId = nanoid();
  await createVerification({ id: verificationId, userId: createdUser.id });
  await sendEmail({
    to: createdUser.email,
    subject: "Verification Email",
    content: `Verify your email using this <a href='${clientUrl}/verify/${verificationId}'>link</a>`,
  });

  const response: HttpResponseMessage = {
    message: "Signup successful",
    success: true,
  };

  res.status(201).send(response);
};

export const verifyEmail: RequestHandler = async (req, res, _next) => {
  const { id } = req.query;

  if (typeof id !== "string") {
    throw generateHttpError("Bad Request");
  }

  const verification = await deleteVerification(id);

  if (!verification) {
    throw generateHttpError("Conflict");
  }

  const verifiedUser = await verifyUser(verification.userId);

  if (!verifiedUser) {
    throw generateHttpError("Internal");
  }

  const response: HttpResponseMessage = {
    success: true,
    message: "Verification successful",
  };

  res.send(response);
};
