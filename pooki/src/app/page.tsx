"use client";
import { Card } from "@/components/Card";
import { Cursor } from "@/components/cursor";
import { space_grotesk } from "@/components/fonts";
import { SearchBar } from "@/components/search";
import { usePokiStore } from "@/components/state";
import type { PokemonDType } from "@/components/types";
import {
	loadPokemon,
	MAX_POKEMON,
	MIN_POKEMON,
	nearbyIds,
} from "@/lib/pokemon";
import { cn } from "@/lib/utils";
import {
	motion,
	useMotionValueEvent,
	useReducedMotion,
	useSpring,
	useTransform,
	type MotionValue,
} from "framer-motion";
import { useEffect, useState } from "react";

function CarouselCard({
	pokemon,
	progress,
}: { pokemon: PokemonDType; progress: MotionValue<number> }) {
	const offset = useTransform(progress, (value) => pokemon.id - value);
	const x = useTransform(offset, (value) => value * 300);
	const y = useTransform(
		offset,
		(value) => -10 + Math.min(Math.abs(value), 1) * 70,
	);
	const rotateZ = useTransform(
		offset,
		(value) => Math.max(-2, Math.min(2, value)) * 6,
	);
	const scale = useTransform(
		offset,
		(value) => 1 - Math.min(Math.abs(value), 2) * 0.2,
	);
	const opacity = useTransform(offset, [-2, -1, 0, 1, 2], [0, 1, 1, 1, 0]);
	const dimming = useTransform(
		offset,
		[-2, -1, 0, 1, 2],
		[0.85, 0.65, 0, 0.65, 0.85],
	);
	const zIndex = useTransform(offset, (value) =>
		Math.round(100 - Math.abs(value) * 10),
	);

	return (
		<motion.div
			className="absolute"
			style={{ x, y, rotateZ, scale, opacity, zIndex }}
			data-pokemon-id={pokemon.id}
		>
			<Card pokemonD={pokemon} />
			<motion.div
				className="pointer-events-none absolute inset-0 rounded-xl bg-[#252525]"
				style={{ opacity: dimming }}
			/>
		</motion.div>
	);
}

export default function Page() {
	const { id, setID, searchActive } = usePokiStore();
	const [pokemons, setPokemons] = useState<Record<number, PokemonDType>>({});
	const [displayedID, setDisplayedID] = useState(id);
	const [windowCenter, setWindowCenter] = useState(id);
	const [loadError, setLoadError] = useState(false);
	const [retry, setRetry] = useState(0);
	const reducedMotion = useReducedMotion();
	const progress = useSpring(id, { stiffness: 220, damping: 30, mass: 1 });

	useMotionValueEvent(progress, "change", (value) => {
		setWindowCenter((current) =>
			Math.round(value) === current ? current : Math.round(value),
		);
	});

	useEffect(() => {
		let cancelled = false;
		setLoadError(false);
		const load = async (pokemonID: number) => {
			const pokemon = await loadPokemon(pokemonID);
			if (!cancelled)
				setPokemons((previous) =>
					previous[pokemonID]
						? previous
						: { ...previous, [pokemonID]: pokemon },
				);
		};
		// Prioritize the three visible cards. Keep the current selection until all are ready.
		Promise.all(nearbyIds(id, 1).map(load))
			.then(() => {
				if (!cancelled) setDisplayedID(id);
			})
			.catch(() => {
				if (!cancelled) setLoadError(true);
			});
		// Warm a wider buffer for repeated navigation and direction changes.
		nearbyIds(id, 6)
			.filter((value) => Math.abs(value - id) > 1)
			.forEach((value) => {
				void load(value).catch(() => {});
			});
		return () => {
			cancelled = true;
		};
	}, [id, retry]);

	useEffect(() => {
		// Search jumps should not sweep across hundreds of unloaded cards.
		if (reducedMotion || Math.abs(displayedID - progress.get()) > 3) {
			progress.jump(displayedID);
			setWindowCenter(displayedID);
		} else {
			progress.set(displayedID);
		}
	}, [displayedID, progress, reducedMotion]);

	const navigate = (delta: number) => {
		const current = usePokiStore.getState().id;
		setID(Math.max(MIN_POKEMON, Math.min(MAX_POKEMON, current + delta)));
	};

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null;
			if (
				searchActive ||
				target?.isContentEditable ||
				target?.closest("input, textarea, select")
			)
				return;
			const delta =
				event.key === "ArrowRight" || event.key === "d"
					? 1
					: event.key === "ArrowLeft" || event.key === "a"
						? -1
						: 0;
			if (!delta) return;
			event.preventDefault();
			const current = usePokiStore.getState().id;
			setID(Math.max(MIN_POKEMON, Math.min(MAX_POKEMON, current + delta)));
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [setID, searchActive]);

	return (
		<div className="flex h-screen items-center justify-center">
			<Cursor />
			<SearchBar />
			<h1
				className={cn(
					space_grotesk.className,
					"absolute top-2 left-2 opacity-20 font-black",
				)}
			>
				#{displayedID.toString().padStart(5, "0")}
			</h1>
			<div className="absolute inset-0 z-[1000] grid grid-cols-2 pointer-events-none">
				<button
					type="button"
					aria-label="Previous Pokémon"
					onClick={() => navigate(-1)}
					className="pointer-events-auto w-full h-full"
				/>
				<button
					type="button"
					aria-label="Next Pokémon"
					onClick={() => navigate(1)}
					className="pointer-events-auto w-full h-full"
				/>
			</div>
			<div className="absolute inset-0 flex items-center justify-center overflow-hidden">
				{Object.values(pokemons)
					.filter((pokemon) => Math.abs(pokemon.id - windowCenter) <= 3)
					.map((pokemon) => (
						<CarouselCard
							key={pokemon.id}
							pokemon={pokemon}
							progress={progress}
						/>
					))}
			</div>
			{(id !== displayedID || !pokemons[displayedID] || loadError) && (
				<div
					role="status"
					className="absolute bottom-10 z-[1100] text-sm text-white/60"
				>
					{loadError ? (
						<button
							type="button"
							onClick={() => setRetry((value) => value + 1)}
						>
							Couldn't load Pokémon. Try again
						</button>
					) : (
						"Loading Pokémon…"
					)}
				</div>
			)}
		</div>
	);
}
