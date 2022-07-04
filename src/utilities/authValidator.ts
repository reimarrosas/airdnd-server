import { generateHttpError } from "./httpErrors";
import { hasKey } from "./typeNarrower";

/* === Property Validators === */
export const isEmailValid = (email: unknown) =>
  typeof email === "string" &&
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    email
  );

const isPasswordValid = (password: unknown) =>
  typeof password === "string" &&
  /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/.test(password);

const isUserTypeValid = (type: unknown) =>
  typeof type === "string" && (type === "Owner" || type === "Renter");

const isFullNameValid = (fullName: unknown) =>
  typeof fullName === "string" && fullName.trim().length !== 0;

const isPhoneNumberValid = (phoneNumber: unknown) =>
  typeof phoneNumber === "string" &&
  phoneNumber.replace(/\D/, "").length === 10;

const isExtensionValid = (extension: unknown) => {
  if (typeof extension !== "string") return false;
  const normalized = extension.replace(/\D/, "");
  return normalized.length >= 2 && normalized.length <= 8;
};

/* === Type Narrowing === */
const isTypeLoginCreds = (reqBody: unknown): reqBody is LoginCreds =>
  typeof reqBody === "object" &&
  reqBody !== null &&
  hasKey(reqBody, "email") &&
  hasKey(reqBody, "password") &&
  hasKey(reqBody, "type");

const isLoginCredContentValid = ({ email, password, type }: LoginCreds) =>
  isEmailValid(email) && isPasswordValid(password) && isUserTypeValid(type);

const isTypeSignupCreds = (reqBody: unknown): reqBody is SignupCreds =>
  isTypeLoginCreds(reqBody) &&
  hasKey(reqBody, "fullName") &&
  hasKey(reqBody, "phoneNumber") &&
  hasKey(reqBody, "extension");

const isUniqueSignupCredValid = ({
  fullName,
  phoneNumber,
  extension,
}: SignupCreds) =>
  isFullNameValid(fullName) &&
  isPhoneNumberValid(phoneNumber) &&
  isExtensionValid(extension);

export const isIdPositiveInt = (id: unknown): id is number => {
  let idNum: number;
  if (typeof id === "string") {
    idNum = parseInt(id);
  } else {
    return false;
  }

  return Number.isInteger(idNum) && idNum > 0;
};

const isRecoveryRequestValid = (
  recoveryRequest: unknown
): recoveryRequest is RecoveryRequest =>
  typeof recoveryRequest === "object" &&
  recoveryRequest !== null &&
  hasKey(recoveryRequest, "id") &&
  hasKey(recoveryRequest, "password");

/* === Request Validators === */
export const isLoginCredsValid = (reqBody: unknown) => {
  if (isTypeLoginCreds(reqBody) && isLoginCredContentValid(reqBody)) {
    return reqBody;
  }

  throw generateHttpError("Bad Request");
};

export const isSignupCredsValid = (reqBody: unknown) => {
  if (
    isTypeSignupCreds(reqBody) &&
    isLoginCredContentValid(reqBody) &&
    isUniqueSignupCredValid(reqBody)
  ) {
    return reqBody;
  }
  throw generateHttpError("Bad Request");
};

export const isIdValid = (id: unknown): number => {
  if (isIdPositiveInt(id)) {
    return id;
  }

  throw generateHttpError("Bad Request");
};

export const isRecoveryValid = (recoveryRequest: unknown): RecoveryRequest => {
  if (isRecoveryRequestValid(recoveryRequest)) {
    return recoveryRequest;
  }

  throw generateHttpError("Bad Request");
};
