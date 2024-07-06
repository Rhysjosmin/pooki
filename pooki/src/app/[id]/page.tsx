"use client";

import { rubix } from "@/components/fonts";
import { ProgressBar } from "@/components/progress";
import { usePokiStore } from "@/components/state";
import { cn } from "@/lib/utils";
import { Canvas } from "@react-three/fiber";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Image as DImage,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  RoundedBox,
} from "@react-three/drei";
import { RoundedBoxGeometry } from "three/examples/jsm/Addons.js";
import { ThreeDCard } from "@/components/threeCard";

const MotionImage = motion(Image);
export default function Page({ params }: { params: { id: string } }) {
  const [currentPookiData, setCurrentPookiData] = useState<null | any>(null);
  const { pookiList, updatePookiList } = usePokiStore();
  useEffect(() => {
    const hasToRefresh = () => {
      if (pookiList == null) {
        return true;
      }
      console.log(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
      if (
        pookiList
          .map((x) => x.url)
          .includes(`https://pokeapi.co/api/v2/pokemon/${params.id}`)
      ) {
        return false;
      }
      return true;
    };

    if (hasToRefresh()) {
      axios
        .get(
          `https://pokeapi.co/api/v2/pokemon/?offset=${Number.parseInt(params.id) - 1}&limit=20`,
        )
        .then((e) => {
          return e.data;
        })
        .then((d) => {
          updatePookiList(d.results);
        });
    }

    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${params.id}`)
      .then((r) => r.data)
      .then((d) => setCurrentPookiData(d));
  }, [params.id, pookiList, updatePookiList]);
  if (currentPookiData == null) {
    return <div className="bg-neutral-950" />;
  }
  return (
    <main className="p-4 z-10 relative h-screen w-full flex items-center justify-center ">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ background: "radial-gradient(#2e2e2e,#101010)" }}
        className="border border-white/5  backdrop-blur-lg w-full  h-full p-12 rounded-xl flex items-center justify-center"
      >
        <div className=" grid grid-cols-2 gap-24">
          <div>
            <h1
              className={cn(
                "text-xl font-thin capitalize text-white",
                rubix.className,
              )}
            >
              {currentPookiData["types"][0]["type"]["name"]}
            </h1>
            <h1
              className={cn(
                "text-8xl font-bold capitalize text-white",
                rubix.className,
              )}
            >
              {currentPookiData["name"]}
            </h1>
            <div className=" flex gap-2">
              <h1 className={cn(" text-white", rubix.className)}>
                {Number.parseFloat(currentPookiData["height"]) * 10} cm
              </h1>
              <h1 className={cn(" text-white", rubix.className)}>
                {Number.parseFloat(currentPookiData["weight"]) / 10} kg
              </h1>
            </div>
            <div className="mt-10 flex flex-col gap-2">
              {currentPookiData["stats"].map(
                (stat: { stat: { name: string }; base_stat: string }) => {
                  return <ProgressBar stat={stat} key={stat.stat.name} />;
                },
              )}
            </div>
          </div>
          <div>
            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 0, 2.5]} />
              <Environment preset="city" />
              <ThreeDCard idx={params.id.toString().padStart(3, "0")} />
            </Canvas>
            {/* <MotionImage
              initial={{ filter: "blur(6px)", opacity: 0 }}
              animate={{
                filter: "blur(0)",
                opacity: 1,
              }}
              transition={{ duration: 0.3 }}
              alt="Pokemon Image"
              height={400}
              width={400}
              src={`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${params.id.toString().padStart(3, "0")}.png`}
            /> */}
          </div>
        </div>
      </motion.section>

      <div className="flex absolute text-white bottom-10 -translate-x-1/2 left-1/2">
        <Link
          href={`/${Math.max(Number.parseInt(params.id) - 1, 1)}`}
          className="w-32 text-center hover:-translate-x-2 transition "
        >
          Previous
        </Link>
        <Link
          href={`/${Math.min(Number.parseInt(params.id) + 1, 905)}`}
          className="w-32 text-center hover:translate-x-2 transition "
        >
          Next
        </Link>
      </div>
    </main>
  );
}
