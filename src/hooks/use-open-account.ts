import { getAccount } from "@/app/(dashboard)/accounts/queries";
import { create } from "zustand";

type OpenAccountState = {
  id?: string;
  account?: { id: string; name: string };
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export let useOpenAccount = create<OpenAccountState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: async (id) => {
    const { data } = await getAccount(id);
    set({ id, isOpen: true, account: data });
  },
  onClose: () => set({ isOpen: false }),
}));
