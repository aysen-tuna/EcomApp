"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-6">
      <h2 className="text-red-600 font-semibold">Something went wrong</h2>

      <p className="text-sm text-gray-500">Please try again.</p>

      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        Retry
      </button>
    </div>
  );
}
