'use client'

import { rubix } from "@/components/fonts";
import { usePokiStore } from "@/components/state"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link"
import { useEffect, useState } from "react"



export default function Page({ params }: { params: { id: string } }) {
    const hasToRefresh = () => {
        if (pookiList == null) {
            return true;
        }
        console.log(`https://pokeapi.co/api/v2/pokemon/${params.id}`)
        if (pookiList.map(x => x.url).includes(`https://pokeapi.co/api/v2/pokemon/${params.id}`)) {
            return false;
        } else {
            return true
        }
    };

    const [currentPookiData, setCurrentPookiData] = useState<null | any>(null)
    const { pookiList, updatePookiList } = usePokiStore()
    useEffect(() => {
        if (hasToRefresh()) {
            fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${parseInt(params.id) - 1}&limit=20`)
                .then(e => e.json())
                .then(d => {
                    // console.log(d)
                    updatePookiList(d.results)
                })
        }

        fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`)
            .then(r => r.json())
            .then(d => setCurrentPookiData(d))
    }, [pookiList])
    if (currentPookiData == null) {
        return <div>
        </div>
    }
    return <main className="p-12 bg-gradient-to-t h-screen w-full flex items-center justify-center from-green-600 to-emerald-400">
        <div className=" grid grid-cols-2">
            <div>
                <h1 className={cn("text-xl font-thin capitalize text-white", rubix.className)}>{currentPookiData['types'][0]['type']['name']}</h1>
                <h1 className={cn("text-5xl font-bold capitalize text-white", rubix.className)}>{currentPookiData['name']}</h1>
            </div>
            <Image alt="Pokemon Image" height={500} width={500} src={`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${params.id.toString().padStart(3, '0')}.png`} />
        </div>
        <div className="flex absolute bottom-10 -translate-x-1/2 left-1/2">
            <Button className="w-32">Previous</Button>
            <Button className="w-32">Next</Button>brysselkecks@gmail.com


        </div>
    </main>
}