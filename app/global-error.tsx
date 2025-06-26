// Error boundaries must be Client Components
"use client";

import Error from "next/error";

const GlobalError = ({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
};

export default GlobalError;
