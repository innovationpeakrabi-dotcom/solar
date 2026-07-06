import type { AppProps } from "next/app";
import { InventoryProvider } from "@/hooks/use-inventory";
import { ToastProvider } from "@/hooks/use-toast";
import { ToastViewport } from "@/components/ui/toast";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <InventoryProvider>
        <Component {...pageProps} />
        <ToastViewport />
      </InventoryProvider>
    </ToastProvider>
  );
}
