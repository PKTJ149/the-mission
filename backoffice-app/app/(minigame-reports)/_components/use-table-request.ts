"use client";

import { useCallback, useRef, useState } from "react";

// table.js requestData(): hides the table, shows .table-loading for at least 500 ms,
// then swaps in the new rows. Answers of older requests are dropped ("Prevent faster filters").
export function useTableRequest() {
  const [loading, setLoading] = useState(false);
  const ticket = useRef(0);

  const run = useCallback(async <T>(request: Promise<T>, apply: (value: T) => void) => {
    const id = ++ticket.current;
    setLoading(true);
    const [value] = await Promise.all([request, new Promise((resolve) => setTimeout(resolve, 500))]);
    if (id !== ticket.current) return;
    apply(value);
    setLoading(false);
  }, []);

  return { loading, run };
}
