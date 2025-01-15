"use client";

import { useSearchParams } from "next/navigation";

export default function DummyPage() {
  const searchParams = useSearchParams();
  const word = searchParams.get("word");
  return (
    <div>
      <span>{word} dummy</span>
    </div>
  );
}
