"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { DocumentView } from "../components/DocumentView";
import { AuthContextWrapper } from "../contexts/AuthContextWrapper";

function DocumentContent() {
  const searchParams = useSearchParams();
  const documentId = searchParams.get("documentId") ?? "";
  return (
    <div>
      <DocumentView documentId={documentId} />
    </div>
  );
}

export default function DocumentPage() {
  return (
    <AuthContextWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <DocumentContent />
      </Suspense>
    </AuthContextWrapper>
  );
}
