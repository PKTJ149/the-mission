"use client";

import { useRef, useState } from "react";

// table.js behaviour for the mock tables: every filter / page change empties the table, shows
// .table-loading for at least 500 ms (its "fallback" promise) and then puts the new rows in.
// The first data comes from the server render, so the page opens already filled.
export function useReportTable<F, R>(load: (filters: F) => Promise<R>, initialFilters: F, initialData: R) {
  const [filters, setFilters] = useState(initialFilters);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const ticket = useRef(0);

  const run = (next: F) => {
    // Only the newest request may fill the table ("Prevent faster filters" in table.js)
    const current = ++ticket.current;
    setLoading(true);
    Promise.all([load(next), new Promise((resolve) => setTimeout(resolve, 500))]).then(([result]) => {
      if (current !== ticket.current) return;
      setData(result);
      setLoading(false);
    });
  };

  // Change some filters and reload
  const update = (patch: Partial<F>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    run(next);
  };

  // Reload with the current filters (e.g. after a local save)
  const refresh = () => run(filters);

  return { filters, data, loading, update, refresh };
}
