"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SLIDE_DURATION_MS = 5000;
const FADE_DURATION_MS = 1200;

const workerImages = [
  {
    src: "/images/plumber.svg",
    alt: "Smiling plumber adjusting copper pipes in a modern home",
  },
  {
    src: "/images/electrician.svg",
    alt: "Electrician checking a fuse board with safety gear",
  },
  {
    src: "/images/cleaner.svg",
    alt: "Professional cleaner wiping a kitchen counter with supplies nearby",
  },
  {
    src: "/images/painter.svg",
    alt: "Painter rolling a fresh coat of paint onto an interior wall",
  },
  {
    src: "/images/gardener.svg",
    alt: "Gardener trimming hedges in a landscaped garden",
  },
  {
    src: "/images/carpenter.svg",
    alt: "Carpenter sanding a wooden cabinet in a workshop",
  },
];

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

export default function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMounted = useRef(false);
  const slides = workerImages;
  const slidesToRender = prefersReducedMotion ? slides.slice(0, 1) : slides;

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || slides.length <= 1) {
      setActiveIndex(0);
      return undefined;
    }

    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, SLIDE_DURATION_MS);

    return () => window.clearInterval(id);
  }, [prefersReducedMotion, slides.length]);

  return (
    <section className="hero" data-motion={prefersReducedMotion ? "reduced" : "default"}>
      <div className="hero__background" aria-hidden="true">
        {slidesToRender.map((image, index) => {
          const isActive = index === activeIndex;
          const shouldSkipTransition = !hasMounted.current && index === 0;
          const transitionDuration = `${FADE_DURATION_MS}ms`;
          const slideClassName = [
            "hero__slide",
            isActive && "hero__slide--active",
            shouldSkipTransition && "hero__slide--instant",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={image.src}
              className={slideClassName}
              style={
                prefersReducedMotion
                  ? undefined
                  : {
                      transitionDuration,
                    }
              }
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="100vw"
                priority={index === 0}
                className="hero__slide-image"
              />
            </div>
          );
        })}
        <div className="hero__backdrop" />
      </div>

      <div className="hero__overlay" />

      <div className="hero__content">
        <p className="hero__eyebrow">Trusted trades across Ireland</p>
        <h1 className="hero__title">FixEasy Ireland</h1>
        <p className="hero__tagline">Real local pros. Upfront pricing. Book in minutes.</p>
        <Link href="/book" className="hero__cta">
          Book a Service
        </Link>
      </div>
    </section>
  );
}
