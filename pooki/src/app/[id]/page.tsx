"use client";

import { rubix } from "@/components/fonts";
import { usePokiStore } from "@/components/state";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const MotionImage = motion(Image)
export default function Page({ params }: { params: { id: string } }) {
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

	const [currentPookiData, setCurrentPookiData] = useState<null | any>(null);
	const { pookiList, updatePookiList } = usePokiStore();
	useEffect(() => {
		if (hasToRefresh()) {
			axios
				.get(
					`https://pokeapi.co/api/v2/pokemon/?offset=${Number.parseInt(params.id) - 1}&limit=20`,
				)
				.then((e) => {
					return e.data;
				})
				.then((d) => {
					// console.log(d)
					updatePookiList(d.results);
				});
		}

		axios
			.get(`https://pokeapi.co/api/v2/pokemon/${params.id}`)
			.then((r) => r.data)
			.then((d) => setCurrentPookiData(d));
	}, [pookiList]);
	if (currentPookiData == null) {
		return <div className="bg-neutral-950" />;
	}
	return (
		<main className="p-4  h-screen w-full flex items-center justify-center bg-neutral-900">
			<motion.section initial={{translateY:0}} animate={{translateY:0}} className="bg-gradient-to-t from-green-600 to-emerald-400 w-full  h-full p-12 rounded-xl flex items-center justify-center">
				<div className=" grid grid-cols-2">
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
								"text-5xl font-bold capitalize text-white",
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
						<div className="">
							{currentPookiData["stats"].map((stat: { stat: { name: string }; base_stat: string }) => {
								return (
									<div>
										<h4 className="text-white capitalize">

											{stat["stat"]["name"]}
										</h4>
										<div className="w-32 bg-gray-700">
											<motion.div className="bg-white h-1 transition-all" initial={{ width: 0 }} animate={{ width: (Number.parseFloat(stat["base_stat"]) / 255) * 100 + "%" }} transition={{ duration: .7, ease: 'easeInOut' }} />
										</div>

									</div>
								);
							})}
						</div>
					</div>
					<MotionImage
						initial={{ filter: 'blur(6px)' }}
						animate={{ filter: 'blur(0)' }}
						transition={{ duration: .3 }}
						alt="Pokemon Image"
						height={400}
						width={400}
						src={`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${params.id.toString().padStart(3, "0")}.png`}
					/>
				</div>
			</motion.section>
				<div className="flex absolute bottom-10 -translate-x-1/2 left-1/2">
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
