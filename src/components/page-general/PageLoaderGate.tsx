"use client";

import { ReactNode, useEffect, useState } from "react";

import Loader from "./Loader";

interface PageLoaderGateProps {
  children: ReactNode;
  minDurationMs?: number;
}

export default function PageLoaderGate({ children, minDurationMs = 800 }: PageLoaderGateProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, minDurationMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [minDurationMs]);

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
}
