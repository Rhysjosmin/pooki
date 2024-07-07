"use client";
import { Card } from "@/components/Card";
import { Cursor } from "@/components/cursor";
import { space_grotesk, space_mono } from "@/components/fonts";
import { SearchBar } from "@/components/search";
import { usePokiStore } from "@/components/state";
import type { PokemonDType } from "@/components/types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

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
    updateDB(1025);
    updateDB(1);
    updateDB(2);
    updateDB(3);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (pokemons === null) {
      return;
    }
    if (Object.keys(pokemons).length > 3) {
      updateDB(id);
      updateDB(id + 1);
      updateDB(id + 2);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
 

  if (pokemons == null) {
    return <>sdfdsf</>;
  }
  if (Object.keys(pokemons).length < 3) {
    return <>asdfs</>;
  }
  return (
    <div className="flex h-screen items-center justify-center">
      <Cursor/>
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
          onClick={() => setID(Math.max(id - 1, 1))}
          className="w-full h-full bg-white/10 "
        />
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <div
          onClick={() => setID(Math.min(id + 1, 1000))}
          className="w-full h-full bg-white/10 "
        />
      </div>
      <AnimatePresence mode="sync">
        {Object.keys(pokemons)
          .sort((a, s) => Number.parseInt(a) - Number.parseInt(s))
          .slice(id - 1, id)
          // .sort((a, b) => a.id - b.id)
          .map((x) => (
            <div
              className="top-0 overflow-hidden absolute inset-0 flex items-center justify-center"
              key={x}
            >
              <motion.div
                transition={{ duration: 0.2 }}
                style={{ transformStyle: "preserve-3d" }}
                className="absolute "
                initial={{
                  opacity: 1,
                  translateY: -10,
                  translateX: 0,
                  rotateZ: 0,
                  rotateY: 0,
                  filter: "blur(0px)",
                  scale: 1,
                }}
                animate={{
                  translateY: 60,
                  translateX: -300,
                  rotateZ: -6,
                  rotateY: -10,
                  opacity: 0.5,
                  filter: "blur(5px) brightness(0.4)",
                  scale: 0.8,
                }}
                exit={{
                  translateY: 60,
                  translateX: -600,
                  rotateZ: -12,
                  rotateY: -30,
                  opacity: 0,
                  filter: "blur(8px)",
                }}
              >
                <Card pokemonD={pokemons[Number.parseInt(x) - 1]} />
              </motion.div>

              <motion.div
                transition={{ duration: 0.2 }}
                className="absolute z-[100]"
                initial={{
                  translateY: 60,
                  translateX: 300,
                  rotateZ: 6,
                  rotateY: 10,
                  opacity: 0.3,
                  filter: "blur(2px)",
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  translateY: -10,
                  translateX: 0,
                  rotateZ: 0,
                  rotateY: 0,
                  filter: "blur(0px)",
                  scale: 1,
                }}
                exit={{
                  translateY: 60,
                  translateX: -300,
                  rotateZ: -6,
                  rotateY: -10,
                  opacity: 0.5,
                  filter: "blur(5px) brightness(0.4)",
                  scale: 0.8,
                }}
              >
                <Card pokemonD={pokemons[Number.parseInt(x)]} />
              </motion.div>

              <motion.div
                transition={{ duration: 0.2 }}
                style={{ transformStyle: "preserve-3d" }}
                className="absolute "
                initial={{
                  opacity: 0,
                  translateY: 100,
                  translateX: 700,
                  rotateY: 10,
                  rotateZ: 80,
                  scale: 1,
                }}
                animate={{
                  translateY: 60,
                  translateX: 300,
                  rotateZ: 6,
                  rotateY: 10,
                  opacity: 0.5,
                  filter: "blur(5px) brightness(0.4)",
                  scale: 0.8,
                }}
                exit={{
                  opacity: 1,
                  translateY: -10,
                  translateX: 0,
                  rotateZ: 0,
                  rotateY: 0,
                  filter: "blur(0px)",
                  scale: 1,
                }}
              >
                <Card pokemonD={pokemons[Number.parseInt(x) + 1]} />
              </motion.div>
            </div>
          ))}
      </AnimatePresence>
    </div>
  );
}
