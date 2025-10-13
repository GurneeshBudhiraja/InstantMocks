"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DashboardButton } from "@/components/ui/dashboard-button";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate main content
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate stats
      gsap.fromTo(
        statsRef.current?.children || [],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <div ref={contentRef}>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-poppins leading-snug">
              Ready to Accelerate Your Development?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <DashboardButton
                text="Start Building"
                size="lg"
                className="text-lg px-8 py-6 font-roboto-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
