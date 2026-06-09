"use client";

import { useEffect, useState } from "react";
import { DEFAULT_STYLE, STYLES, RoomStyle } from "./styles";

const KEY = "roomi.selectedStyle";

export function getStoredStyle(): RoomStyle {
  if (typeof window === "undefined") return DEFAULT_STYLE;
  const id = window.localStorage.getItem(KEY);
  return STYLES.find((s) => s.id === id) ?? DEFAULT_STYLE;
}

export function useSelectedStyle() {
  const [style, setStyleState] = useState<RoomStyle>(DEFAULT_STYLE);

  useEffect(() => {
    setStyleState(getStoredStyle());
  }, []);

  function setStyle(s: RoomStyle) {
    setStyleState(s);
    window.localStorage.setItem(KEY, s.id);
  }

  return { style, setStyle };
}
