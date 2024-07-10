import { cn } from "@/lib/utils";
import Image from "next/image";
import type React from "react";
import { useEffect, useState } from "react";
import type { PokemonDType } from "./types";
import { space_grotesk, space_mono } from "./fonts";
import Link from "next/link";
import { SvgSpinners180Ring } from "./icons";
type _Props = React.HTMLProps<HTMLDivElement>;
interface CardProps extends _Props {
  pokemonD: PokemonDType;
}
export function Card(props: CardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  useEffect(() => {
    console.log(props.pokemonD);
  }, [props.pokemonD]);
  const pookieData = props.pokemonD;
  if (pookieData == null || pookieData === undefined) {
    return (
      <div
        {...props}
        className={cn(
          "w-96 shadow-2xl p-4 h-auto bg-[#2B2B2B] border-dashed border border-white/10 aspect-[9/12] rounded-xl",
        )}
      />
    );
  }
  return (
    <div
      {...props}
      className={cn(
        "w-96 shadow-2xl p-4 h-auto bg-[#252525] border-dashed border border-white/20 aspect-[9/12] overflow-hidden rounded-xl",
      )}
    >
      <Image
        className="absolute inset-0 h-full object-cover bg-blend-overlay opacity-10 rounded-xl"
        alt=""
        src={"/noise2.png"}
        height={500}
        width={500}
      />
      <h1 className={cn(space_mono.className, "absolute text")}>
        #{pookieData.id.toString().padStart(5, "0")}
      </h1>
      <div className="rounded-lg relative h-[40%] flex items-center justify-center p-24 ">
        <div
          style={{ opacity: imageLoaded ? 0 : 1 }}
          className="absolute w-full h-full flex items-center justify-center"
        >
          <SvgSpinners180Ring className="size-10" />
        </div>
        <Image
          style={{ opacity: imageLoaded ? 1 : 0 }}
          onLoad={() => setImageLoaded(true)}
          className="drop-shadow-lg transition-opacity duration-300 "
          src={`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${pookieData.id
            .toString()
            .padStart(3, "0")}.png`}
          height={200}
          width={200}
          quality={0}
          alt=""
        />
      </div>
      <div className=" p-2  pt-3 w-full h-[60%] ">
        <h1
          className={cn(
            "text-2xl capitalize font-bold ",
            space_grotesk.className,
          )}
        >
          {pookieData.name}
        </h1>
        <div className="text-xs text-white/40 flex gap-4  ">
          <p>weight : {pookieData.weight} g</p>
          <p>height : {pookieData.height * 10} cm</p>
        </div>
        <div className="text-xs text-white/40 flex gap-4  ">
          Abilities :
          {pookieData.abilities.map((x) => {
            return (
              <Link
                href={`ability/${x.ability.url.split("/")[x.ability.url.split("/").length - 2]}`}
                key={x.ability.name}
              >
                {x.ability.name}
              </Link>
            );
          })}
        </div>
        <div className="bottom-0  w-full mt-4">
          {pookieData.stats.map(({ stat, base_stat }) => (
            <div className="mb-1 relative" key={stat.name}>
              <p
                className={cn(
                  "lowercase text-sm text-white/60 mt-2 mb-0.5",
                  space_grotesk.className,
                )}
              >
                {stat.name}
              </p>
              <p
                className={cn(
                  "lowercase absolute top-0 right-0 text-xs text-white/20 mt-0.5 ",
                  space_grotesk.className,
                )}
              >
                {base_stat}
              </p>
              <div className="h-0.5  w-full bg-white/5 ">
                <div
                  className="bg-gradient-to-r duration-700 transition-all from-neutral-500 via-neutral-300 via-[80%] to-neutral-100 h-full"
                  style={{ width: `${(base_stat / 255) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
