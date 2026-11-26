"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import posterOne from "../../../../public/brightacademyposter.jpeg";
import posterTwo from "../../../../public/brightacademyposterTwo.jpeg";

interface PosterSlide {
  src: StaticImageData;
  alt: string;
}

const posterSlides: PosterSlide[] = [
  { src: posterOne, alt: "Bright Academy Poster 1" },
  { src: posterTwo, alt: "Bright Academy Poster 2" },
];

export default function HeroPosterSlider() {
  const autoplay = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    autoplay.current,
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className="w-full h-95 lg:h-105 overflow-hidden"
        ref={emblaRef}
      >
        <div className="flex h-full">
          {posterSlides.map((slide, idx) => (
            <div
              key={idx}
              className="relative flex-[0_0_100%] min-w-0 h-full"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-contain"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Slide indicators */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {posterSlides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => emblaApi?.scrollTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              selectedIndex === idx
                ? "w-6 bg-orange-500"
                : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
