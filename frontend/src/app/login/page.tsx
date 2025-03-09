import React, { Suspense } from "react";

import LoginForm from "@/app/components/LoginForm";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
