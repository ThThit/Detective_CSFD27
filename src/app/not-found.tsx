import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen px-6 text-center">
      <p className="font-mono text-sm tracking-[0.3em] uppercase text-foreground/40 mb-4">
        Case File #404
      </p>
      <h1 className="font-display text-7xl sm:text-9xl font-bold text-foreground mb-4">
        404
      </h1>
      <h2 className="font-serif text-2xl sm:text-3xl italic text-foreground/80 mb-6">
        This lead went cold.
      </h2>
      <p className="font-serif text-lg text-foreground/60 max-w-sm mb-10">
        The page you&apos;re looking for has gone undercover — or never existed at all.
      </p>
      <Link
        href="/"
        className="font-mono text-sm tracking-widest uppercase border border-foreground/30 px-8 py-3 hover:bg-foreground hover:text-background transition-colors"
      >
        Return to HQ
      </Link>
    </div>
  );
}
