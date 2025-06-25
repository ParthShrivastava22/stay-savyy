/* eslint-disable @typescript-eslint/no-explicit-any */

import prismadb from "@/lib/prismadb";

export const getHomeById = async (homeId: string) => {
  try {
    const home = await prismadb?.home.findUnique({
      where: {
        id: homeId,
      },
    });

    if (!home) return null;
    return home;
  } catch (error: any) {
    throw new Error(error);
  }
};
