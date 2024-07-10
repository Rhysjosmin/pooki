"use client";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { rubix, space_mono } from "./fonts";
import { useEffect, useState, useRef } from "react";
import { usePokiStore } from "./state";
import { Button } from "./ui/button";

export function SearchBar() {
  // const [searchActive, setSearchActive] = useState(false);
  const [results, setResults] = useState([1, 1, 2, 46]);
  const [data, setData] = useState();
  const [searchField, setSearchField] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const { searchActive, setSearchActive } = usePokiStore();

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=1000")
      .then((r) => r.json())
      .then((d) => setData(d));
  }, []);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === "S") {
        setSearchActive(true);
      } else if (event.key === "Escape") {
        setSearchActive(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    if (searchActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchActive]);
  return (
    <>
      <p
        className={cn(
          space_mono.className,
          "absolute  bottom-2 left-2 text-xs text-white/40",
        )}
      >
        <span className="inline-block px-1 py-0.5 bg-white/10 rounded">
          ctrl + shift + s
        </span>{" "}
        to open search
      </p>
      <div
        style={{
          pointerEvents: searchActive ? "auto" : "none",
          opacity: searchActive ? 1 : 0,
        }}
        className="inset-0  flex absolute transition-all   flex-col items-center p-12 z-[2000] top-0"
      >
        <div
          onClick={() => setSearchActive(false)}
          style={{
            backdropFilter: `blur(${searchActive ? 3 : 0}px)`,
            cursor: searchActive ? "default" : "none",
          }}
          className="bg-neutral-950/80  transition-all  inset-0 absolute -z-10"
        />
        <Input
          onChange={(e) => setSearchField(e.target.value)}
          ref={inputRef}
          style={{ cursor: searchActive ? "text" : "none" }}
          className={cn(
            rubix.className,
            "  border-white/10  bg-neutral-800 rounded-t-xl border-dashed   text-center p-4 text-lg h-12 text-white/70",
          )}
          placeholder="Search"
        />
        <div
          style={{ cursor: searchActive ? "default" : "none" }}
          className="w-full flex p-1 flex-wrap gap-1 rounded-b-xl  bg-neutral-800"
        >
          <div
            style={{ cursor: searchActive ? "default" : "none" }}
            className={cn(rubix.className, "  p-2  text-white/30")}
          >
            <span className="text-orange-200/40 font-medium"> tip:</span> add #
            before to search by id
            <span
              style={{ cursor: searchActive ? "default" : "none" }}
              className="pl-1 "
            >
              eg: single pokemon with{" "}
              <span className="text-green-200/40">`#2` </span>or a range of
              pokemons with <span className="text-green-200/40">`#2-5`</span>
            </span>
          </div>
          <Results data={data} search={searchField} />
        </div>
      </div>
    </>
  );
}

function Results({ data, search }: { data: any; search: string }) {
  const { setID, setSearchActive } = usePokiStore();
  if (data == null || search == "") {
    return <></>;
  }
  return (
    <>
      {data["results"]

        .filter((x: { name: string; url: string }, i: number) => {
          if (search.slice(0, 1) === "#") {
            const mainStr = search.replace("#", "");
            if (search.includes("-")) {
              const nums = mainStr.split("-").map((y) => parseInt(y));
              return i + 2 > nums[0] && i < nums[1];
            }
            return i + 1 === parseInt(mainStr);
          }
          return x.name.includes(search);
        })
        .map((x: { name: string; url: string }) => {
          const id = parseInt(x.url.split("/")[x.url.split("/").length - 2]);
          return (
            <Button
              className="p-2 border-dashed capitalize border border-white/10 hover:border-orange-600/30 bg-neutral-700/50 hover:bg-neutral-600 rounded-xl"
              key={x.name}
              onClick={() => {
                setID(id);
                setSearchActive(false);
              }}
            >
              {x.name.replace("-", " ")}
            </Button>
          );
        })}
    </>
  );
}
