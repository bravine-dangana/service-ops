'use client';

import { useCallback, useEffect, useState } from 'react';

function storageKeyFor(serviceSlug: string) {
  return `service-ops:progress:${serviceSlug}`;
}

export function useProgress(serviceSlug: string, stepIds: string[]) {
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKeyFor(serviceSlug));
      if (raw) {
        const parsed: string[] = JSON.parse(raw);
        setReviewed(new Set(parsed.filter((id) => stepIds.includes(id))));
      }
    } catch {
      // localStorage unavailable (e.g. private browsing) — fall back to in-memory state.
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceSlug]);

  const toggleStep = useCallback(
    (stepId: string) => {
      setReviewed((prev) => {
        const next = new Set(prev);
        if (next.has(stepId)) {
          next.delete(stepId);
        } else {
          next.add(stepId);
        }
        try {
          window.localStorage.setItem(storageKeyFor(serviceSlug), JSON.stringify([...next]));
        } catch {
          // ignore write failures
        }
        return next;
      });
    },
    [serviceSlug],
  );

  const isReviewed = useCallback((stepId: string) => reviewed.has(stepId), [reviewed]);

  return {
    reviewed,
    toggleStep,
    isReviewed,
    reviewedCount: reviewed.size,
    total: stepIds.length,
    hydrated,
  };
}
