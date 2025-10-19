"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AiBeautifyIcon,
  Edit01Icon,
  Timer01Icon,
  CustomizeIcon,
} from "hugeicons-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: AiBeautifyIcon,
    title: "AI POWERED GENERATION",
    description:
      "Instantly create realistic JSON responses using AI for contextually relevant mock data.",
  },
  {
    icon: Edit01Icon,
    title: "REAL-TIME EDITING",
    description:
      "Effortlessly update mock endpoints with instant changes, no redeployment required.",
  },
  {
    icon: Timer01Icon,
    title: "EPHEMERAL APIS",
    description:
      "Temporary endpoints that auto-expire to keep environments clean and manageable.",
  },
  {
    icon: CustomizeIcon,
    title: "CUSTOMIZABLE RESPONSES",
    description:
      "Adjust headers, status codes, and response formats for tailored mock data.",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power1.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );

      // Features animation
      if (featuresRef.current) {
        Array.from(featuresRef.current.children).forEach((child, i) => {
          gsap.fromTo(
            child,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.3,
              delay: i * 0.03,
              ease: "power1.out",
              scrollTrigger: {
                trigger: featuresRef.current,
                start: "top 90%",
                toggleActions: "play none none none",
                once: true,
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-foreground font-poppins tracking-tight"
          >
            Powerful Features for Modern Development
          </h2>
          <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-roboto">
            Everything you need to create, manage, and share mock APIs that
            accelerate your development workflow.
          </p>
        </div>

        <div ref={featuresRef} className="max-w-6xl mx-auto ">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-4 rounded-lg bg-card border border-border group cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-[0px_0px_9px] shadow-zinc-500/50"
              >
                <div className="flex-shrink-0 mt-1 group-hover:scale-125 group-hover:text-primary group-hover:-rotate-12 transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-foreground mb-1 uppercase tracking-wide font-roboto-mono">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-xs  leading-relaxed tracking-wide font-roboto-mono">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
