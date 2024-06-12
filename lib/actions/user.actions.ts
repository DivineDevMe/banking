"use server";

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

export const signIn = async ({ email, password }: signInProps) => {
  try {
    //Mutation /Db / Make fetch
    const { account } = await createAdminClient();
    const res = await account.createEmailPasswordSession(email, password);
    //  cookies().set("appwrite-session", session.secret, {
    //    path: "/",
    //    httpOnly: true,
    //    sameSite: "strict",
    //    secure: true,
    //  });

    //  const user = await getUserInfo({ userId: session.userId });

    return parseStringify(res);
  } catch (error) {
    console.log(error);
  }
};
export const signUp = async (userData: SignUpParams) => {
  const { email, firstName, lastName, password } = userData;
  try {
    //Mutation /Db / Make fetch
    //create user account using Appwrite

    const { account } = await createAdminClient();

    const newUserAcc = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUserAcc);
  } catch (error) {
    console.log(error);
  }
};
// ... your initilization functions

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    return parseStringify(user);
  } catch (error) {
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();
    cookies().delete("appwrite-session");
    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};
