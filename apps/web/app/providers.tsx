"use client";

import { QueryProvider } from "@/lib/query/provider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            toast: "border-3 border-neutral-900 shadow-brutal-md bg-white",
            title: "text-neutral-900 font-semibold",
            description: "text-neutral-700",
            success: "bg-pastel-green-100",
            error: "bg-pastel-pink-100",
            warning: "bg-pastel-yellow-100",
            info: "bg-pastel-blue-100",
          },
        }}
      />
    </QueryProvider>
  );
}
