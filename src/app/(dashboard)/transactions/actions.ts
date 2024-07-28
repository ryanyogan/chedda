"use server";

import { currentUser } from "@clerk/nextjs/server";
import { createServerActionProcedure } from "zsa";

const authedProcedure = createServerActionProcedure().handler(async () => {
  try {
    const auth = await currentUser();

    if (!auth?.id) {
      throw new Error("Unauthorized");
    }

    return { auth };
  } catch (error) {
    throw new Error("User not authenticated");
  }
});
