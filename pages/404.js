import Base from "@layouts/Base";
import Link from "next/link";

const NotFoundPage = () => (
  <Base title="Page Not Found">
    <div className="py-16 text-center">
      <p className="font-display text-6xl font-bold">
        <span className="gradient-text">404</span>
      </p>
      <h1 className="mt-4 text-2xl font-bold text-text-heading dark:text-darkmode-text-heading">
        This page doesn&rsquo;t exist
      </h1>
      <p className="mx-auto mt-2 max-w-md text-text-secondary dark:text-darkmode-text-secondary">
        The page you&rsquo;re looking for was moved or never existed. Try the
        module overview instead.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link href="/" className="btn btn--primary">
          Back to Home
        </Link>
        <Link href="/modules/" className="btn btn--ghost">
          Browse modules
        </Link>
      </div>
    </div>
  </Base>
);

export default NotFoundPage;
