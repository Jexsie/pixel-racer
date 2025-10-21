"use client";

import { ReactNode } from "react";
import { AllWalletsProvider } from "@/services/wallets/AllWalletsProvider";

export function Providers({ children }: { children: ReactNode }) {
  return <AllWalletsProvider>{children}</AllWalletsProvider>;
}
