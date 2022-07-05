import db from "../config/db.config";

export const getUser = async (user: Partial<UserEntity>) =>
  await db<UserEntity>("users").where(user).first();

export const createUser = async (signupCreds: SignupCreds) =>
  (await db<UserEntity>("users").insert(signupCreds, "*"))[0];

export const changeUserPass = async (id: number, password: string) =>
  (
    await db<UserEntity>("users")
      .where({ id })
      .update("password", password)
      .returning("*")
  )[0];

export const verifyUser = async (id: number) =>
  (
    await db<UserEntity>("users")
      .where({ id })
      .update("isVerified", true)
      .returning("*")
  )[0];
