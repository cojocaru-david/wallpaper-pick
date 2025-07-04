"use client";

import { useMouse } from "@/hooks/use-mouse";

export default function PreviewUseMouse() {
  const [mouse, parentRef] = useMouse();

  return (
    <div
      className=" relative h-fit w-96 rounded-lg border border-neutral-400/10 bg-neutral-400/10 p-4"
      ref={parentRef}
    >
      <p className=" text-neutral-500">
        x: {mouse.x}
        <br />
        y: {mouse.y}
        <br />
        elementX : {mouse.elementX?.toFixed()}
        <br />
        elementY : {mouse.elementY?.toFixed()}
        <br />
        elementPositionX : {mouse.elementPositionX?.toFixed()}
        <br />
        elementPositionY : {mouse.elementPositionY?.toFixed()}
        <br />
      </p>
    </div>
  );
}
