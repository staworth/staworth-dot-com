import { Suspense } from "react";
import ArticlesPageClient from "../../src/components/page-specific/ArticlesPageClient";
import Loader from "../../src/components/page-general/Loader";

export default function ArticlesPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ArticlesPageClient />
    </Suspense>
  );
}
