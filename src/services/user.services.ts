import db from "../config/db.config";

export const getUser = async (email: string) =>
  await db<UserEntity>("users").where({ email }).first();

export const createUser = async (signupCreds: SignupCreds) =>
  (await db<UserEntity>("users").insert(signupCreds, "*"))[0];

export const changeUserPass = async (id: number, password: string) =>
  (
    await db<UserEntity>("users")
      .where({ id })
      .update("password", password)
      .returning("*")
  )[0];
