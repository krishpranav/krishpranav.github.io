import { llmsFullTxt } from "@/lib/seo";

export const dynamic = "force-static";

// /llms-full.txt: everything on the page as plain Markdown, in full.
export function GET() {
  return new Response(llmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
