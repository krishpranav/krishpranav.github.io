"use client";

import { useEffect, useState } from "react";
import { identity } from "@/lib/resume";

const fmt = new Intl.DateTimeFormat("en-SG", {
  timeZone: identity.timeZone,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/* My local time in Singapore, as "4:12 pm". Nothing renders until the client knows the
   time, so the sentence around it reads whole without script and hydration never
   disagrees with the server. */
export default function LocalClock({ before = "" }: { before?: string }) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setNow(fmt.format(new Date()).toLowerCase());
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;
  return (
    <>
      {before}
      <time className="tabular-nums">{now}</time>
    </>
  );
}
