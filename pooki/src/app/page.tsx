"use client";
import { Card } from "@/components/Card";
import { PokemonDType } from "@/components/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { isNull } from "util";
const variants = {};

export default function Page() {
  const [id, setID] = useState(1);
  const [pokemons, setPokemons] = useState<{
    [id: string]: PokemonDType;
  } | null>(null);
  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((resp) => resp.json())
      .then((d) => {
        if (isNull(pokemons)) {
          setPokemons({
            [d["id"]]: { ...(d as any), src: d["sprites"]["front-default"] },
          });
        } else {
          setPokemons({ [id]: d as any, ...pokemons });
        }
        console.log(pokemons);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setPokemons]);
  useEffect(() => {
    console.log(pokemons);
  }, [pokemons]);
  if (pokemons == null) {
    return <></>;
  }
  return (
    <div className="flex h-screen items-center justify-center">
      <AnimatePresence>
        {Object.values(pokemons)
          .sort((a, b) => a.id - b.id)
          .map((x) => (
            <>
              <motion.div
                key={x.id}
                className="absolute z-10"
                initial={{ opacity: 0, translateY: 50 }}
                animate={{ opacity: 1, translateY: -10 }}
              >
                <Card pokemonD={x} />
              </motion.div>

              <motion.div
                style={{ transformStyle: "preserve-3d" }}
                className="absolute "
                initial={{
                  opacity: 0,
                  translateY: 100,
                  translateX: -10,
                  rotateY: 0,
                  rotateZ: 0,
                }}
                animate={{
                  translateY: 60,
                  translateX: 300,
                  rotateZ: 6,
                  rotateY: 10,
                  opacity: 0.3,
                  filter: "blur(2px)",
                }}
              >
                <Card pokemonD={x} />
              </motion.div>
              <motion.div
                style={{ transformStyle: "preserve-3d" }}
                className="absolute "
                initial={{
                  opacity: 0,
                  translateY: 100,
                  translateX: -10,
                  rotateY: 0,
                  rotateZ: 0,
                }}
                animate={{
                  translateY: 60,
                  translateX: -300,
                  rotateZ: -6,
                  rotateY: -10,
                  opacity: 0.3,
                  filter: "blur(5px)",
                }}
              >
                <Card pokemonD={x} />
              </motion.div>
            </>
          ))}
      </AnimatePresence>
    </div>
  );
}
