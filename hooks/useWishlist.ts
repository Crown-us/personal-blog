"use client";

import { useState, useEffect } from "react";

export interface WishlistItem {
  id: string;
  type: "extension" | "source-code";
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("roketdev_wishlist");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setWishlist(parsed);
        }, 0);
      } catch (e) {
        console.error("Failed to parse wishlist items", e);
      }
    }
  }, []);

  const toggleWishlist = (id: string, type: "extension" | "source-code") => {
    let next: WishlistItem[];
    const exists = wishlist.some((item) => item.id === id && item.type === type);
    if (exists) {
      next = wishlist.filter((item) => !(item.id === id && item.type === type));
    } else {
      next = [...wishlist, { id, type }];
    }
    setWishlist(next);
    localStorage.setItem("roketdev_wishlist", JSON.stringify(next));
  };

  const isInWishlist = (id: string, type: "extension" | "source-code") => {
    return wishlist.some((item) => item.id === id && item.type === type);
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem("roketdev_wishlist");
  };

  return {
    wishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  };
}
