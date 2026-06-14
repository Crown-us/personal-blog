"use client";

import { useState, useEffect } from "react";

export function useCompare() {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("roketdev_compare_ids");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setCompareIds(parsed);
        }, 0);
      } catch (e) {
        console.error("Failed to parse compare IDs", e);
      }
    }
  }, []);

  const toggleCompare = (id: string) => {
    let next: string[];
    if (compareIds.includes(id)) {
      next = compareIds.filter((x) => x !== id);
    } else {
      if (compareIds.length >= 3) {
        alert("You can compare up to 3 extensions at a time.");
        return;
      }
      next = [...compareIds, id];
    }
    setCompareIds(next);
    localStorage.setItem("roketdev_compare_ids", JSON.stringify(next));
  };

  const clearCompare = () => {
    setCompareIds([]);
    localStorage.removeItem("roketdev_compare_ids");
  };

  return {
    compareIds,
    toggleCompare,
    clearCompare,
    isComparing: (id: string) => compareIds.includes(id),
  };
}
