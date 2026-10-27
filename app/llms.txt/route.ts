import { llmsTxt } from "@/lib/seo";

export const dynamic = "force-static";

// /llms.txt: who I am and where everything is, for language models and agents.
export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
