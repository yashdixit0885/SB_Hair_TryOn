import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>The page you’re looking for doesn’t exist.</p>
      <Link href="/">Return home</Link>
    </main>
  );
}
