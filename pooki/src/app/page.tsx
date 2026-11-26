"use client";
import { Card } from "@/components/Card";
import { Cursor } from "@/components/cursor";
import { space_grotesk } from "@/components/fonts";
import { SearchBar } from "@/components/search";
import { usePokiStore } from "@/components/state";
import type { PokemonDType } from "@/components/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const cardTransition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1] as const,
};

export default function Page() {
  const { id, setID } = usePokiStore();
  const [pokemons, setPokemons] = useState<{
    [id: number]: PokemonDType;
  } | null>(null);
  const updateDB = (pookieID: number) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pookieID}`)
      .then((resp) => resp.json())
      .then((d) => {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        setPokemons((prevPokemons: any) => ({
          ...prevPokemons,
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          [d.id]: { ...(d as any) },
        }));
      });
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // updateDB(1025);
    updateDB(1);
    updateDB(2);
    updateDB(3);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (pokemons === null) {
      return;
    }

    [-1, 0, 1].forEach((x) => {
      if (!Object.keys(pokemons).includes((id + x).toString())) {
        updateDB(id + x);
        console.log("updated ", id + x);
      }
    });
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "d") {
        setID(Math.min(id + 1, 1000));
      } else if (event.key === "ArrowLeft" || event.key === "a") {
        setID(Math.max(id - 1, 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [id, setID]);

  if (pokemons == null) {
    return <></>;
  }
  if (Object.keys(pokemons).length < 3) {
    return <></>;
  }
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
        #{id.toString().padStart(5, "0")}
      </h1>

      <div className=" absolute inset-0  z-[1000] grid grid-cols-2">
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <div
          onClick={() => {
            setID(Math.max(id - 1, 1));
          }}
          className="w-full h-full bg-white/10 "
        />
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <div
          onClick={() => {
            setID(Math.min(id + 1, 1000));
          }}
          className="w-full h-full bg-white/10 "
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {Object.values(pokemons)
          .filter((pokemon) => Math.abs(pokemon.id - id) <= 1)
          .map((pokemon) => {
            const position = (activeID: number) => {
              const offset = pokemon.id - activeID;
              return {
                x: offset * 300,
                y: offset === 0 ? -10 : 60,
                rotateZ: offset * 6,
                rotateY: offset * 10,
                scale: offset === 0 ? 1 : 0.8,
                opacity: offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.2 : 0,
              };
            };

            return (
              <motion.div
                key={pokemon.id}
                transition={cardTransition}
                className="absolute"
                style={{ zIndex: pokemon.id === id ? 100 : 0 }}
                initial={{ ...position(id), opacity: 0 }}
                animate={position(id)}
              >
                <Card pokemonD={pokemon} />
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}
