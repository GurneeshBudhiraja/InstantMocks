"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FloatingIconProps {
  icon: string;
  size: number;
  x: number;
  y: number;
  delay?: number;
  duration?: number;
  parallaxSpeed?: number;
  className?: string;
}

const FloatingIcon = ({
  icon,
  size,
  x,
  y,
  delay = 0,
  duration = 3,
  parallaxSpeed = 100,
  className = "",
}: FloatingIconProps) => {
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!iconRef.current) return;

    const ctx = gsap.context(() => {
      // Initial floating animation (gentle rotation and opacity)
      gsap.fromTo(
        iconRef.current,
        {
          rotation: 0,
          opacity: 0.2,
        },
        {
          rotation: 360,
          opacity: 0.4,
          duration: duration,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
          delay: delay,
        }
      );

      // Parallax scroll effect - icons move opposite to scroll direction
      gsap.to(iconRef.current, {
        y: `+=${parallaxSpeed}`, // Move down when scrolling up
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
    }, iconRef);

    return () => ctx.revert();
  }, [delay, duration]);

  return (
    <div
      ref={iconRef}
      className={`absolute pointer-events-none select-none text-zinc-500 ${className}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        fontSize: `${size}px`,
      }}
    >
      {icon}
    </div>
  );
};

export default function FloatingIcons() {
  const containerRef = useRef<HTMLDivElement>(null);

  const icons = [
    { icon: "{}", size: 24, x: 10, y: 20, delay: 0, parallaxSpeed: 80 },
    { icon: "</>", size: 20, x: 85, y: 15, delay: 0.5, parallaxSpeed: 120 },
    { icon: "API", size: 16, x: 15, y: 80, delay: 1, parallaxSpeed: 60 },
    { icon: "{}", size: 18, x: 80, y: 75, delay: 1.5, parallaxSpeed: 100 },
    { icon: "JSON", size: 14, x: 5, y: 50, delay: 2, parallaxSpeed: 90 },
    { icon: "REST", size: 12, x: 90, y: 60, delay: 2.5, parallaxSpeed: 70 },
    { icon: "{}", size: 22, x: 50, y: 10, delay: 0.8, parallaxSpeed: 110 },
    { icon: "HTTP", size: 13, x: 25, y: 90, delay: 3, parallaxSpeed: 50 },
    { icon: "{}", size: 16, x: 70, y: 40, delay: 1.2, parallaxSpeed: 85 },
    { icon: "GET", size: 11, x: 40, y: 85, delay: 2.8, parallaxSpeed: 65 },
    { icon: "{}", size: 20, x: 60, y: 25, delay: 1.8, parallaxSpeed: 95 },
    { icon: "POST", size: 12, x: 30, y: 65, delay: 2.2, parallaxSpeed: 75 },
    { icon: "{}", size: 19, x: 75, y: 50, delay: 0.3, parallaxSpeed: 105 },
    { icon: "PUT", size: 11, x: 45, y: 30, delay: 3.2, parallaxSpeed: 55 },
    { icon: "{}", size: 17, x: 20, y: 40, delay: 1.7, parallaxSpeed: 80 },
    { icon: "DELETE", size: 10, x: 55, y: 70, delay: 2.7, parallaxSpeed: 70 },
    { icon: "{}", size: 21, x: 35, y: 15, delay: 0.7, parallaxSpeed: 115 },
    { icon: "PATCH", size: 9, x: 65, y: 85, delay: 3.5, parallaxSpeed: 45 },
    { icon: "{}", size: 15, x: 10, y: 70, delay: 1.3, parallaxSpeed: 85 },
    { icon: "OPTIONS", size: 8, x: 85, y: 35, delay: 2.9, parallaxSpeed: 60 },
  ];

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none "
    >
      {icons.map((iconData, index) => (
        <FloatingIcon
          key={index}
          {...iconData}
          className="font-mono font-bold"
        />
      ))}
    </div>
  );
}
