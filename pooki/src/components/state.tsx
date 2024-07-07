import { create } from "zustand";
import type { PokemonDType } from "./types";

// const [id, setID] = useState(1);
// const [pokemons, setPokemons] = useState<{
//   [id: number]: PokemonDType;
// } | null>(null);

// const [searchActive, setSearchActive] = useState(false);
export interface storeType {
  id: number;
  setID: (x: number) => void;
  searchActive: boolean;
  setSearchActive: (x: boolean) => void;
  //   pokemons: {
  //     [id: number]: PokemonDType;
  //   } | null;
  //   setPokemons: (
  //     newValues: {
  //       [id: number]: PokemonDType;
  //     } | null
  //   ) => void;
}
export const usePokiStore = create<storeType>((set) => ({
  // pokemons: null,
  // setPokemons: (newValues) => set({ pokemons: newValues }),
  id: 1,
  setID: (x) => set({ id: x }),
  searchActive: false,
  setSearchActive: (x) => set({ searchActive: x }),
}));
