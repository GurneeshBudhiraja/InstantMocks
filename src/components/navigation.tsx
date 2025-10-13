"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { CodeIcon, GithubIcon } from "hugeicons-react";
import Link from "next/link";

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      let lastScrollY = window.scrollY;
      const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (navRef.current) {
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            gsap.to(navRef.current, {
              y: -100,
              duration: 0.3,
              ease: "power2.out",
            });
          } else {
            gsap.to(navRef.current, {
              y: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        }
        lastScrollY = currentScrollY;
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
    >
      <div className="container mx-auto px-2 font-roboto-mono">
        <div className="flex items-center justify-end h-16 gap-4">
          <Button
            size="sm"
            className="hidden md:flex bg-primary hover:bg-primary/90 cursor-pointer"
          >
            Get Started
          </Button>
          <Button
            size="sm"
            className="relative bg-black hover:bg-gray-800 cursor-pointer overflow-hidden group transition-all duration-300 border border-gray-700 hover:border-white/30"
          >
            {/* Minimalistic shiny effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
            <div className="absolute inset-0 rounded-md border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Button content */}
            <Link
              className="relative flex items-center space-x-2"
              href={"https://github.com/GurneeshBudhiraja/InstantMocks"}
              target="_blank"
            >
              <GithubIcon className="h-4 w-4 text-white" />
              <span className="hidden sm:inline-block text-sm font-medium text-white">
                GitHub
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
