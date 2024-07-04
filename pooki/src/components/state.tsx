import { create } from "zustand";

interface storeType {
	pookiList: null | Array<{ name: string; url: string }>;
	setPookiList: (newValues: Array<{ name: string; url: string }>) => void;
	updatePookiList: (newValues: Array<{ name: string; url: string }>) => void;
}
export const usePokiStore = create<storeType>((set) => ({
	pookiList: null,
	setPookiList: (newValues) => set({ pookiList: newValues }),
	updatePookiList: (newValues) =>
		set((state) => ({
			pookiList: (state.pookiList ?? []).concat(
				newValues.filter(
					(x) => !state.pookiList?.some((item) => item.url === x.url),
				),
			),
		})),
}));
