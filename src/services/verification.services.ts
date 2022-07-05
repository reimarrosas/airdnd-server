import db from "../config/db.config";

export const createVerification = async (verification: Verification) =>
  (await db<VerificationEntity>("verifications").insert(verification))[0];

export const deleteVerification = async (id: string) =>
  (await db<VerificationEntity>("verifications").where({ id }).delete("*"))[0];
