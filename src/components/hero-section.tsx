"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { DashboardButton } from "@/components/ui/dashboard-button";
import { AuroraBackground } from "./ui/aurora-background";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
        .fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.3"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <AuroraBackground>
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="relative z-20 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1
              ref={titleRef}
              className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight font-poppins"
            >
              <span className="text-primary">Instant</span>Mocks
            </h1>

            <p
              ref={subtitleRef}
              className="text-xl  text-muted-foreground mb-8 max-w-3xl mx-auto font-roboto"
            >
              Create, edit, and share AI-powered mock API endpoints instantly to
              speed up development with ephemeral, customizable data.
            </p>

            {/* CTA Buttons */}
            <div
              ref={ctaRef}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link href="#features" className="">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 borde hover:bg-accent cursor-pointer font-roboto-mono"
                >
                  Features
                </Button>
              </Link>
              <DashboardButton
                text="Get Started"
                size="lg"
                className="text-lg px-8 py-6 font-roboto-mono"
              />
            </div>
          </div>
        </div>
      </section>
    </AuroraBackground>
  );
}
