"use client";

import { useEffect, useState } from 'react';

export function CalendlyEmbed() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="min-h-[700px] bg-muted rounded-lg animate-pulse" />;
  }
  
  return (
    <div className="min-h-[700px] bg-background rounded-lg shadow-xl border overflow-hidden">
      <iframe
        src="https://calendly.com/your-username"
        width="100%"
        height="700"
        frameBorder="0"
        title="Schedule a Discovery Call"
        style={{ border: 0 }}
      ></iframe>
    </div>
  );
}
