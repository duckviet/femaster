// components/landing-content.tsx
"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  IconArrowRight,
  IconBolt,
  IconCode,
  IconLayout,
  IconRocket,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

gsap.registerPlugin(ScrollTrigger);

interface LandingContentProps {
  challengeCount: number;
  domainCount: number;
  firstChallengeId?: string;
}

const highlights = [
  {
    title: "Bài toán thực tế",
    description:
      "Tập trung vào pattern và bài toán thường gặp trong frontend interview.",
    icon: IconCode,
  },
  {
    title: "Thực hành ngay",
    description:
      "Có live demo + practice flow để học và kiểm tra tư duy triển khai.",
    icon: IconBolt,
  },
  {
    title: "Lộ trình rõ ràng",
    description:
      "Sắp xếp theo domain và subcategory để nâng cấp kỹ năng có hệ thống.",
    icon: IconLayout,
  },
];

export function LandingContent({
  challengeCount,
  domainCount,
  firstChallengeId,
}: LandingContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLElement>(null);

  const startHref = firstChallengeId
    ? `/challenges/${firstChallengeId}`
    : "/challenges";

  // Hero entrance animation
  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // Header
      gsap.from("[data-animate='header']", {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });

      // Hero section — staggered
      const heroTl = gsap.timeline({ delay: 0.2 });

      heroTl.from("[data-animate='badge']", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });

      heroTl.from(
        "[data-animate='heading']",
        {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.2",
      );

      heroTl.from(
        "[data-animate='description']",
        {
          y: 30,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3",
      );

      heroTl.from(
        "[data-animate='cta']",
        {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.2",
      );

      // Stats card — slide in from right
      heroTl.from(
        "[data-animate='stats']",
        {
          x: 60,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.5",
      );

      // Stats rows stagger
      heroTl.from(
        "[data-animate='stat-row']",
        {
          x: 30,
          opacity: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.3",
      );
    },
    { scope: containerRef, dependencies: [] },
  );

  // Highlights — scroll triggered
  useGSAP(
    () => {
      const section = highlightsRef.current;
      if (!section) return;

      const cards = section.querySelectorAll("[data-animate='card']");

      gsap.set(cards, { y: 50, opacity: 0 });

      ScrollTrigger.batch(cards, {
        start: "top 85%",
        onEnter: (batch) => {
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out",
          });
        },
        once: true,
      });
    },
    { scope: highlightsRef, dependencies: [] },
  );

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-background text-foreground"
    >
      <section className="mx-auto max-w-6xl px-6 py-8 md:py-10">
        <header
          data-animate="header"
          className="flex items-center justify-between border-b pb-5"
        >
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 bg-primary"
              style={{
                maskImage: 'url("/logo/femaster-icon.svg")',
                WebkitMaskImage: 'url("/logo/femaster-icon.svg")',
                maskRepeat: "no-repeat",
                maskSize: "contain",
              }}
            />
            <span className="text-lg font-semibold">Femaster</span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild>
              <Link href={startHref}>
                Start Discovering
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </header>

        <div
          ref={heroRef}
          className="grid gap-8 py-12 md:grid-cols-[1.3fr_1fr] md:items-center"
        >
          <div className="space-y-5">
            <div data-animate="badge">
              <Badge variant="outline">Frontend Engineering Challenges</Badge>
            </div>
            <h1
              data-animate="heading"
              className="text-4xl font-semibold leading-tight md:text-5xl"
            >
              Luyện tư duy frontend hiện đại,
              <br />
              từ architecture đến performance.
            </h1>
            <p
              data-animate="description"
              className="max-w-xl text-sm text-muted-foreground md:text-base"
            >
              Femaster giúp bạn học qua challenge thực chiến, có demo trực quan,
              code solution rõ ràng và luồng practice để tự kiểm chứng.
            </p>

            <div
              data-animate="cta"
              className="flex flex-wrap items-center gap-3"
            >
              <Button asChild size="lg">
                <Link href={startHref}>
                  Explore Challenges
                  <IconRocket className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/challenges">View Curriculum</Link>
              </Button>
            </div>
          </div>

          <Card data-animate="stats" ref={statsRef} className="h-full">
            <CardHeader className="border-b">
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 pt-4">
              <div
                data-animate="stat-row"
                className="flex items-center justify-between border p-3"
              >
                <span className="text-muted-foreground">Total Challenges</span>
                <span className="font-semibold">{challengeCount}</span>
              </div>
              <div
                data-animate="stat-row"
                className="flex items-center justify-between border p-3"
              >
                <span className="text-muted-foreground">Domains</span>
                <span className="font-semibold">{domainCount}</span>
              </div>
              <div
                data-animate="stat-row"
                className="flex items-center justify-between border p-3"
              >
                <span className="text-muted-foreground">Focus</span>
                <span className="font-semibold">Mid → Senior</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <section ref={highlightsRef} className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} data-animate="card">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 text-muted-foreground">
                  {item.description}
                </CardContent>
              </Card>
            );
          })}
        </section>
      </section>
    </main>
  );
}
