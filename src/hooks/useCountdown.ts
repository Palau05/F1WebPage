"use client";

import { useState, useEffect } from "react";
import { getCountdown } from "@/lib/utils/dates";

export function useCountdown(targetDate: string) {
  const [countdown, setCountdown] = useState(getCountdown(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return countdown;
}
