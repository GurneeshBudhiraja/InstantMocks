"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CodeIcon,
  Github01Icon,
  TwitterIcon,
  Linkedin01Icon,
  Mail01Icon,
  GithubIcon,
} from "hugeicons-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            end: "bottom 10%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <CodeIcon className="h-8 w-8 text-primary" />
              <span
                className="text-xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                InstantMocks
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md font-roboto">
              The dynamic API sandbox that enables developers to create, edit,
              and share mock API endpoints effortlessly.
            </p>
            <div className="flex space-x-4">
              <Link
                className="text-muted-foreground hover:text-primary transition-colors"
                href={"https://github.com/GurneeshBudhiraja/InstantMocks"}
                target="_blank"
              >
                <GithubIcon className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/gurneesh-budhiraja"
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin01Icon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center font-roboto-mono">
          <p className="text-muted-foreground text-sm ">
            © 2025 InstantMocks. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 ">
            <div className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer">
              Privacy Policy
            </div>
            <div className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer">
              Terms of Service
            </div>
            <div className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer">
              Cookie Policy
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
