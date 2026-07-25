import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-island px-6 text-center">
      <h1 className="text-4xl font-extrabold text-primary drop-shadow-sm">Atlas</h1>
      <p className="max-w-md text-primary/80">Explore. Discover. Understand.</p>
      <Link
        href="/lesson/make-a-ten"
        className="cursor-pointer rounded-pill bg-primary px-8 py-4 text-lg font-bold text-white shadow-atlas transition-transform duration-200 hover:scale-105"
      >
        Start: Make a Ten
      </Link>
    </main>
  );
}
