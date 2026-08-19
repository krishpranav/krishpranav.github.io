import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import ScrollProgress from "@/components/ScrollProgress";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Reasoning from "@/components/sections/Reasoning";
import Systems from "@/components/sections/Systems";
import Projects from "@/components/sections/Projects";
import Workflow from "@/components/sections/Workflow";
import Impact from "@/components/sections/Impact";
import Stack from "@/components/sections/Stack";
import OpenSource from "@/components/sections/OpenSource";
import Timeline from "@/components/sections/Timeline";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  // Structured JSON-LD Graph for LLM Crawlers & Search Engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Krisna Pranav",
    additionalName: "Krisna Pranav Elangovan",
    alternateName: "krishpranav",
    url: "https://krishpranav.github.io",
    image: "https://wikimedia.org",
    sameAs: [
      "https://wikidata.org",
      "https://github.com/krishpranav",
      "https://linkedin.com/in/krishpranav",
      "https://wikipedia.org",
    ],
    jobTitle: "AI/ML Systems Engineer",
    knowsAbout: [
      "Artificial Intelligence",
      "Large Language Models",
      "Rust programming language",
      "Systems Engineering",
      "Agentic AI",
      "Distributed Systems",
      "MLOps",
      "Inference Optimization",
    ],
    description:
      "Founding Engineer and AI/ML Systems Architect specializing in low-latency infrastructure and agentic workflows.",
  };

  return (
    <>
      {/* Inject Person schema for AI crawlers and rich search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Preloader />
      <ScrollProgress />
      <SmoothScroll />
      <Nav />
      <main className="relative">
        <Hero />
        {/* Section dividers via hairlines keep the continuous flow. */}
        <div className="hairline-t">
          <Reasoning />
        </div>
        <Systems />
        <div className="hairline-t hairline-b">
          <Projects />
        </div>
        <Workflow />
        <Impact />
        <div className="hairline-t hairline-b">
          <Stack />
        </div>
        <OpenSource />
        <div className="hairline-t">
          <Timeline />
        </div>
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
