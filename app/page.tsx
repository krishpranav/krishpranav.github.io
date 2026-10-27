import Shell from "@/components/shell/Shell";
import Contact from "@/components/sections/Contact";
import Cities from "@/components/sections/Cities";
import Hero from "@/components/sections/Hero";
import Hobbies from "@/components/sections/Hobbies";
import OpenSource from "@/components/sections/OpenSource";
import Path from "@/components/sections/Path";
import Principles from "@/components/sections/Principles";
import Story from "@/components/sections/Story";
import Work from "@/components/sections/Work";
import { identity, roles } from "@/lib/resume";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identity.name,
  alternateName: "krishpranav",
  url: identity.links.site,
  image: `${identity.links.site}/me/illustrated-1200.jpg`,
  email: `mailto:${identity.links.email}`,
  jobTitle: "Senior Software Engineer, AI/ML",
  worksFor: { "@type": "Organization", name: roles[0].company },
  address: { "@type": "PostalAddress", addressLocality: "Singapore", addressCountry: "SG" },
  sameAs: [identity.links.github, identity.links.linkedin, identity.links.x],
  knowsAbout: [
    "Agentic AI",
    "LLM orchestration",
    "Retrieval-augmented generation",
    "Distributed systems",
    "Rust",
    "Go",
    "Python",
    "MLOps",
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Shell />
      <main id="main" className="relative">
        <Hero />
        <Story />
        <Work />
        <OpenSource />
        <Path />
        <Principles />
        <Hobbies />
        <Cities />
        <Contact />
      </main>
    </>
  );
}
