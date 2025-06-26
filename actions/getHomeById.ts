/* eslint-disable @typescript-eslint/no-explicit-any */

import prismadb from "@/lib/prismadb";

export const getHomeById = async (homeId: string) => {
  try {
    const home = await prismadb?.home.findUnique({
      where: {
        id: homeId,
      },
    });

    if (!home) return undefined;
    return Object.fromEntries(
      Object.entries(home).map(([key, value]) => [
        key,
        value === null ? undefined : value,
      ])
    ) as typeof home;
  } catch (error: any) {
    throw new Error(error);
  }
};
