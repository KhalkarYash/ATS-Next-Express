"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps as NextThemeProviderProps,
} from "next-themes";

// Extend ThemeProviderProps to include children
interface ExtendedThemeProviderProps extends NextThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({
  children,
  ...props
}: ExtendedThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
