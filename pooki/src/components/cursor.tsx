"use client";

import { useEffect, useRef, useState } from "react";
import { MaterialSymbolsArrowCircleRightRounded } from "./icons";
import { usePokiStore } from "./state";

export function Cursor() {
  const { searchActive } = usePokiStore();
  const [position, setPosition] = useState({ x: "80%", y: "50%" });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [width, setWidth] = useState(0);

  const prevPosition = useRef({ x: 0, y: 0 });
  const prevTime = useRef(Date.now());

  useEffect(() => {
    if (window) {
      setWidth(window.innerWidth);
    }
    const handleMouseMove = (event: MouseEvent) => {
      const newTime = Date.now();
      const deltaTime = (newTime - prevTime.current) / 1000; // Convert to seconds

      const newPosition = { x: event.clientX, y: event.clientY };
      const newVelocity = {
        x: (newPosition.x - prevPosition.current.x) / deltaTime,
        y: (newPosition.y - prevPosition.current.y) / deltaTime,
      };

      setPosition(newPosition);
      setVelocity(newVelocity);
      //   console.log(newVelocity)
      prevPosition.current = newPosition;
      prevTime.current = newTime;
    };
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.addEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      style={{
        opacity: searchActive ? 0 : 1,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <div
        className="   text-white  flex items-center justify-center text-5xl "
        style={{
          position: "absolute",
          top: position.y,
          left: position.x,

          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      >
        <MaterialSymbolsArrowCircleRightRounded
          className="transition-all duration-300"
          style={{ rotate: position.x < width / 2 ? "180deg" : "0deg" }}
        />
      </div>
    </div>
  );
}
