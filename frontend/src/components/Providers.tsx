// src/components/Providers.tsx
"use client";

import { ReactNode } from "react";
import { UserProvider } from "./UserContext";
import { CartProvider } from "./CartContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <CartProvider>{children}</CartProvider>
    </UserProvider>
  );
}