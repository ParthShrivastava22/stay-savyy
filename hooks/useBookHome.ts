import { create } from "zustand";
import { HomeFormData } from "@/components/home/AddHomeForm";
import { persist } from "zustand/middleware";

interface BookHomeStore {
  bookingHomeData: HomeDataType | null;
  clientSecret: string | undefined;
  setHomeData: (data: HomeDataType) => void;
  resetBookHome: () => void;
}

type HomeDataType = {
  home: HomeFormData;
  totalPrice: number;
  startDate: Date;
  endDate: Date;
};

const useBookHome = create<BookHomeStore>()(
  persist(
    (set) => ({
      bookingHomeData: null,
      paymentIntent: null,
      clientSecret: undefined,
      setHomeData: (data: HomeDataType) => {
        set({ bookingHomeData: data });
      },
      resetBookHome: () => {
        set({
          bookingHomeData: null,
          clientSecret: undefined,
        });
      },
    }),
    {
      name: "BookHome",
    }
  )
);

export default useBookHome;
