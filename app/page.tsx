import Shell from "@/components/shell/Shell";
import Contact from "@/components/sections/Contact";
import Cities from "@/components/sections/Cities";
import Hero from "@/components/sections/Hero";
import Hobbies from "@/components/sections/Hobbies";
import OpenSource from "@/components/sections/OpenSource";
import Origin from "@/components/sections/Origin";
import Path from "@/components/sections/Path";
import Principles from "@/components/sections/Principles";
import Story from "@/components/sections/Story";
import Work from "@/components/sections/Work";
import { structuredData } from "@/lib/seo";

// The site, this page as my profile page, and me, as one linked graph (lib/seo.ts).
const jsonLd = structuredData();

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Shell />
      <main id="main" className="relative">
        <Hero />
        <Story />
        <Origin />
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
