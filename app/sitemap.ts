import type { MetadataRoute } from "next";
import { BUILT, SITE } from "@/lib/seo";
import { identity } from "@/lib/resume";

export const dynamic = "force-static";

// The one page (with my portrait, for image search), the résumé and the plain-text
// profile for language models.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, lastModified: BUILT, changeFrequency: "weekly", priority: 1, images: [`${SITE}/me/illustrated-1200.jpg`] },
    { url: `${SITE}${identity.links.resume}`, lastModified: BUILT, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/llms-full.txt`, lastModified: BUILT, changeFrequency: "weekly", priority: 0.5 },
  ];
}
