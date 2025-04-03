"use client";
import { useSearchParams } from "next/navigation";

import { DocumentView } from "../components/DocumentView";

export default function DocumentPage() {
  const searchParams = useSearchParams();
  const documentId = searchParams.get("documentId") ?? "";
  return (
    <div>
      <DocumentView documentId={documentId} />
    </div>
  );
}
