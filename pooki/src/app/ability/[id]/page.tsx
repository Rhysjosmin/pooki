"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: number } }) {
  const [data, setData] = useState<{
    name: string;
    effect_entries: Array<{ language: { name: string }; effect: string }>;
    pokemon: Array<{ pokemon: { name: string } }>;
  } | null>(null);
  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/ability/${params.id}/`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        console.log(d);
      });
  }, [params.id]);
  if (data == null) {
    return <></>;
  }
  return (
    <main className="p-12">
      {/* biome-ignore lint/complexity/useLiteralKeys: <explanation> */}
      <h1 className="capitalize text-3xl">{data["name"]}</h1>
      <div>
        {data.effect_entries
          .filter((x) => x.language.name === "en")
          .map((x) => x.effect)}
      </div>
      <div className="flex flex-wrap gap-1 mt-3 w-2/3">
        {data.pokemon.map((x) => (
          <Link key={x.pokemon.name} href={"/"}>
            {x.pokemon.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
