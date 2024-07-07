export interface PokemonDType {
  src: string;
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: Array<{
    ability: { name: string; url: string };
    hidden: boolean;
    slot: number;
  }>;
  stats: Array<{
    stat: { name: string; url: string };
    base_stat: number;
  }>;
}
