"use client";

import { useCallback, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const morphTime = 1.5;
const cooldownTime = 0.5;

const isMobile = () => {
  if (typeof window === "undefined") return false;
  return (
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
};

const useMorphingText = (texts: string[]) => {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(new Date());

  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  const targetFPS = isMobile() ? 30 : 60;
  const frameInterval = 1000 / targetFPS;

  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2] = [text1Ref.current, text2Ref.current];
      if (!current1 || !current2) return;

      const isMobileDevice = isMobile();
      const maxBlur = isMobileDevice ? 4 : 8;
      const blur1 = Math.min(
        maxBlur / (1 - fraction + 0.1) - maxBlur,
        maxBlur * 2
      );
      const blur2 = Math.min(maxBlur / (fraction + 0.1) - maxBlur, maxBlur * 2);

      current2.style.filter = `blur(${blur2}px)`;
      current2.style.opacity = `${Math.pow(fraction, 0.4)}`;
      current2.style.transform = "translate3d(0, 0, 0)";

      const invertedFraction = 1 - fraction;
      current1.style.filter = `blur(${blur1}px)`;
      current1.style.opacity = `${Math.pow(invertedFraction, 0.4)}`;
      current1.style.transform = "translate3d(0, 0, 0)";

      current1.textContent = texts[textIndexRef.current % texts.length];
      current2.textContent = texts[(textIndexRef.current + 1) % texts.length];
    },
    [texts]
  );

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / morphTime;

    if (fraction > 1) {
      cooldownRef.current = cooldownTime;
      fraction = 1;
    }

    setStyles(fraction);

    if (fraction === 1) {
      textIndexRef.current++;
    }
  }, [setStyles]);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const [current1, current2] = [text1Ref.current, text2Ref.current];
    if (current1 && current2) {
      current2.style.filter = "none";
      current2.style.opacity = "1";
      current2.style.transform = "translate3d(0, 0, 0)";
      current1.style.filter = "none";
      current1.style.opacity = "0";
      current1.style.transform = "translate3d(0, 0, 0)";
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = 0;

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        const newTime = new Date();
        const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
        timeRef.current = newTime;

        cooldownRef.current -= dt;

        if (cooldownRef.current <= 0) {
          doMorph();
        } else {
          doCooldown();
        }

        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [doMorph, doCooldown, frameInterval]);

  return { text1Ref, text2Ref };
};

interface MorphingTextProps {
  className?: string;
  texts: string[];
}

const Texts: React.FC<Pick<MorphingTextProps, "texts">> = ({ texts }) => {
  const { text1Ref, text2Ref } = useMorphingText(texts);
  return (
    <div
      className="grid w-full h-full"
      style={{
        placeItems: "center",
        contain: "layout style paint",
      }}
    >
      <span
        className="col-start-1 row-start-1 w-full h-full"
        ref={text1Ref}
        style={{
          willChange: "opacity, filter, transform",
          backfaceVisibility: "hidden",
          perspective: 1000,
        }}
      />
      <span
        className="col-start-1 row-start-1 w-full h-full"
        ref={text2Ref}
        style={{
          willChange: "opacity, filter, transform",
          backfaceVisibility: "hidden",
          perspective: 1000,
        }}
      />
    </div>
  );
};

const SvgFilters: React.FC = () => (
  <svg id="filters" className="h-0 w-0" preserveAspectRatio="xMidYMid slice">
    <defs>
      <filter id="threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
);

export const MorphingText: React.FC<MorphingTextProps> = ({
  texts,
  className,
}) => (
  <div
    className={cn(
      "flex w-full font-syne font-bold leading-none",

      "text-[clamp(2.5rem,4vw,6rem)] sm:text-[clamp(2rem,5vw,6rem)] lg:text-[clamp(2.5rem,6vw,6rem)]",

      "[filter:url(#threshold)_blur(0.3px)] sm:[filter:url(#threshold)_blur(0.6px)]",
      className
    )}
    style={{
      contain: "layout style paint",
      willChange: "transform",
      backfaceVisibility: "hidden",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    }}
  >
    <Texts texts={texts} />
    <SvgFilters />
  </div>
);
