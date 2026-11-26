import type { PokemonDType } from "@/components/types";

export const MIN_POKEMON = 1;
export const MAX_POKEMON = 1000;
export const artworkUrl = (id: number) =>
	`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${id.toString().padStart(4, "0")}.png`;

const requests = new Map<number, Promise<PokemonDType>>();

export function loadPokemon(id: number): Promise<PokemonDType> {
	const existing = requests.get(id);
	if (existing) return existing;

	const request = fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
		.then(async (response) => {
			if (!response.ok) throw new Error(`Could not load Pokémon ${id}`);
			const pokemon: PokemonDType = await response.json();
			// Use the same image URL as the card so the browser can reuse its cache.
			await new Promise<void>((resolve) => {
				const image = new window.Image();
				image.onload = () => resolve();
				image.onerror = () => resolve();
				image.src = artworkUrl(id);
				if (image.complete) resolve();
			});
			return pokemon;
		})
		.catch((error) => {
			requests.delete(id);
			throw error;
		});
	requests.set(id, request);
	return request;
}

export function nearbyIds(id: number, radius: number) {
	return Array.from(
		{ length: radius * 2 + 1 },
		(_, index) => id + index - radius,
	).filter((value) => value >= MIN_POKEMON && value <= MAX_POKEMON);
}
