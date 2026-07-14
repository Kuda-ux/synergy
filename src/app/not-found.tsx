import { SearchX } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <SearchX size={48} aria-hidden className="text-subtle" />
      <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">Page not found</h1>
      <p className="mt-3 text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/shop" variant="outline">Browse Products</ButtonLink>
        <ButtonLink href="/">Back to Home</ButtonLink>
      </div>
    </div>
  );
}
