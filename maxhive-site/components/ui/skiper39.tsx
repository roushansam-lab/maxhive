"use client";

import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";

interface CrowdCanvasProps {
  src: string;
  rows?: number;
  cols?: number;
}

const CrowdCanvas = ({ src, rows = 15, cols = 7 }: CrowdCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Guards against the image finishing loading after unmount / Strict Mode cleanup.
    let disposed = false;

    // Reduced motion: draw one static frame of the crowd instead of animating it.
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const config = {
      src,
      rows,
      cols,
    };

    // UTILS
    const randomRange = (min: number, max: number) =>
      min + Math.random() * (max - min);
    const randomIndex = (array: any[]) => randomRange(0, array.length) | 0;
    const removeFromArray = (array: any[], i: number) => array.splice(i, 1)[0];
    const removeItemFromArray = (array: any[], item: any) =>
      removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = (array: any[]) =>
      removeFromArray(array, randomIndex(array));
    const getRandomFromArray = (array: any[]) => array[randomIndex(array) | 0];

    // TWEEN FACTORIES
    const resetPeep = ({ stage, peep }: { stage: any; peep: any }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return {
        startX,
        startY,
        endX,
      };
    };

    const normalWalk = ({ peep, props }: { peep: any; props: any }) => {
      const { startX, startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.5, 1.5));
      tl.to(
        peep,
        {
          duration: xDuration,
          x: endX,
          ease: "none",
        },
        0,
      );
      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: xDuration / yDuration,
          yoyo: true,
          y: startY - 10,
        },
        0,
      );

      return tl;
    };

    const walks = [normalWalk];

    // TYPES
    type Peep = {
      image: HTMLImageElement;
      rect: number[];
      width: number;
      height: number;
      drawArgs: any[];
      x: number;
      y: number;
      anchorY: number;
      scaleX: number;
      walk: any;
      setRect: (rect: number[]) => void;
      render: (ctx: CanvasRenderingContext2D) => void;
    };

    // FACTORY FUNCTIONS
    const createPeep = ({
      image,
      rect,
    }: {
      image: HTMLImageElement;
      rect: number[];
    }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        drawArgs: [],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (rect: number[]) => {
          peep.rect = rect;
          peep.width = rect[2];
          peep.height = rect[3];
          peep.drawArgs = [peep.image, ...rect, 0, 0, peep.width, peep.height];
        },
        render: (ctx: CanvasRenderingContext2D) => {
          ctx.save();
          ctx.translate(peep.x, peep.y);
          ctx.scale(peep.scaleX, 1);
          ctx.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.width,
            peep.height,
          );
          ctx.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    // MAIN
    const img = document.createElement("img");
    const stage = {
      width: 0,
      height: 0,
    };

    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    const createPeeps = () => {
      const { rows, cols } = config;
      const { naturalWidth: width, naturalHeight: height } = img;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;

      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [
              (i % rows) * rectWidth,
              ((i / rows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          }),
        );
      }
    };

    const initCrowd = () => {
      while (availablePeeps.length) {
        addPeepToCrowd().walk.progress(Math.random());
      }
    };

    const addPeepToCrowd = () => {
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({
          peep,
          stage,
        }),
      }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;

      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      return peep;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const render = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(devicePixelRatio, devicePixelRatio);

      crowd.forEach((peep) => {
        peep.render(ctx);
      });

      ctx.restore();
    };

    const resize = () => {
      if (!canvas) return;
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * devicePixelRatio;
      canvas.height = stage.height * devicePixelRatio;

      crowd.forEach((peep) => {
        peep.walk.kill();
      });

      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();

      if (reducedMotion) {
        // Freeze every walker at its random starting position and draw once.
        crowd.forEach((peep) => peep.walk.pause());
        render();
      }
    };

    const init = () => {
      if (disposed) return;
      createPeeps();
      resize();
      if (!reducedMotion) gsap.ticker.add(render);
    };

    img.onload = init;
    img.src = config.src;

    const handleResize = () => {
      if (allPeeps.length) resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;
      img.onload = null;
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
    };
  }, [src, rows, cols]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 h-full w-full"
      style={{
        // Heads that rise to the top edge of the canvas fade out softly instead of
        // being cut off or running into the headline above.
        maskImage: "linear-gradient(to bottom, transparent 0, #000 12%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 12%)",
      }}
    />
  );
};

// Seconds "LOST IN THE CROWD" stays on screen before it swaps.
const HOLD_FIRST_HEADLINE = 2.8;

/**
 * Headline that swaps from "LOST IN THE CROWD" to "WE CAN HELP YOU STAND OUT".
 * Both states share one grid cell, so the box is always as tall as the taller
 * state and nothing moves when they swap. Only the headline is animated; the
 * crowd canvas runs on its own GSAP timelines and is never touched here.
 */
const HeroHeadline = () => {
  const rootRef = useRef<HTMLHeadingElement>(null);
  const firstRef = useRef<HTMLSpanElement>(null);
  const secondRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Reduced motion is handled in CSS (motion-reduce: classes below): the final
    // message is shown immediately with no animation.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const first = firstRef.current;
    const second = secondRef.current;
    if (!first || !second) return;

    // gsap.context collects every tween created inside it, so revert() on cleanup
    // kills them all. That keeps React Strict Mode (mount, unmount, mount) from
    // leaving a duplicate timeline running.
    const ctx = gsap.context(() => {
      gsap.set(first, { autoAlpha: 1, y: 0 });
      gsap.set(second, { autoAlpha: 0, y: 24 });

      gsap
        .timeline({ delay: HOLD_FIRST_HEADLINE })
        .to(first, {
          autoAlpha: 0,
          y: -24,
          duration: 0.6,
          ease: "power2.in",
        })
        // ">" starts the second headline only after the first has fully
        // faded, so the two never overlap.
        .to(
          second,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          ">",
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const headlineClass =
    "col-start-1 row-start-1 block text-center font-black uppercase leading-[0.95] tracking-tight text-balance text-[#171717] [font-size:clamp(2rem,min(7vw,10vh),6rem)]";

  return (
    <h1
      ref={rootRef}
      className="grid w-full max-w-5xl place-items-center font-sans"
    >
      {/* One announcement for assistive tech; the animated copy is hidden from it. */}
      <span className="sr-only">
        Lost in the crowd. We can help you stand out.
      </span>

      <span
        ref={firstRef}
        aria-hidden="true"
        className={`${headlineClass} motion-reduce:invisible motion-reduce:opacity-0`}
      >
        Lost in the crowd
      </span>

      <span
        ref={secondRef}
        aria-hidden="true"
        className={`${headlineClass} invisible opacity-0 motion-reduce:visible motion-reduce:opacity-100`}
      >
        <span className="text-[#171717]">We can help you </span>
        <span className="whitespace-nowrap text-[#FBB040]">Stand out</span>
      </span>
    </h1>
  );
};

const Skiper39 = () => {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-white text-[#171717]">
      <div className="pointer-events-none relative z-10 flex shrink-0 justify-center px-4 pb-[2vh] pt-[clamp(100px,14vh,150px)]">
        <HeroHeadline />
      </div>
      <div className="relative min-h-0 flex-1">
        <CrowdCanvas
          src="https://cdn.21st.dev/assets/localized/abdb8990a7bef8c2f5af3e45f0a3c969c4b0603fba8be92e81347de4ea4e1ed7.png"
          rows={15}
          cols={7}
        />
      </div>
    </div>
  );
};

export { CrowdCanvas, Skiper39 };
export default Skiper39;

/**
 * Skiper 39 Canvas_Landing_004 — React + Canvas
 * Inspired by and adapted from https://codepen.io/zadvorsky/pen/xxwbBQV
 * illustration by https://www.openpeeps.com/
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren’t associated with the codepen.io . They’re independent recreations meant to study interaction design
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
