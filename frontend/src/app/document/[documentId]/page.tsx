"use client";
import { useParams } from "next/navigation";

import { DocumentView } from "../../components/DocumentView";

export default function DocumentPage() {
  const params = useParams();
  return (
    <div>
      <DocumentView documentId={params.documentId as string} />
    </div>
  );
}