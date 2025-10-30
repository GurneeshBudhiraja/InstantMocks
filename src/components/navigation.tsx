'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { DashboardButton } from '@/components/ui/dashboard-button';
import { GithubIcon } from 'hugeicons-react';
import Link from 'next/link';
import { PlayIcon } from 'lucide-react';

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );

      let lastScrollY = window.scrollY;
      const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (navRef.current) {
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            gsap.to(navRef.current, {
              y: -100,
              duration: 0.3,
              ease: 'power2.out',
            });
          } else {
            gsap.to(navRef.current, {
              y: 0,
              duration: 0.3,
              ease: 'power2.out',
            });
          }
        }
        lastScrollY = currentScrollY;
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
    >
      <div className="mx-auto font-roboto-mono px-5">
        <div className="flex items-center justify-end h-16 gap-4">
          <Button size="sm" variant="outline" className="cursor-pointer">
            <Link
              className="flex items-center space-x-2"
              href={'https://www.youtube.com/watch?v=qWWhRj67bEw'}
              target="_blank"
            >
              <PlayIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Demo</span>
            </Link>
          </Button>
          <DashboardButton
            text="Get Started"
            size="sm"
            className="hidden md:flex"
            showArrow={false}
          />
          <Button size="sm" variant="outline" className="cursor-pointer">
            <Link
              className="flex items-center space-x-2"
              href={'https://github.com/GurneeshBudhiraja/InstantMocks'}
              target="_blank"
            >
              <GithubIcon className="h-4 w-4" />
              <span className="hidden sm:inline-block text-sm font-medium">
                GitHub
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
