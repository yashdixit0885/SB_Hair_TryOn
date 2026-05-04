"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main>
      <h1>Something went wrong</h1>
      <p>An unexpected error occurred. Please try again.</p>
      <button onClick={reset} type="button">
        Try again
      </button>
    </main>
  );
}
