/* eslint-disable @typescript-eslint/no-explicit-any */

import prismadb from "@/lib/prismadb";

export const getHomes = async (searchParams: {
  title: string;
  country: string;
  state: string;
  city: string;
}) => {
  try {
    const { title, country, state, city } = searchParams;

    const homes = await prismadb.home.findMany({
      where: {
        title: {
          contains: title,
        },
        country,
        state,
        city,
      },
    });
    return homes;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
