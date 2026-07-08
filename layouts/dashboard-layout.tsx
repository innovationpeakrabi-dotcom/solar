import { useEffect, useState, type ReactNode } from "react";
import Head from "next/head";
import { Sidebar } from "@/layouts/sidebar";
import { Topbar } from "@/layouts/topbar";

export function DashboardLayout({ children, title }: { children: ReactNode; title: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <>
      <Head>
        <title>{`${title} | Inventory Pro`}</title>
        <meta name="description" content="Inventory Management System Dashboard" />
      </Head>
      <div className="min-h-[100dvh] overflow-x-hidden text-slate-950 dark:text-slate-100 sm:min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:pl-72">
          <Topbar
            onMenuClick={() => setSidebarOpen(true)}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode((value) => !value)}
          />
          <main className="mx-auto w-full max-w-[1720px] overflow-x-hidden px-4 py-4 sm:overflow-visible sm:px-6 sm:py-6 lg:px-8 lg:py-9">{children}</main>
        </div>
      </div>
    </>
  );
}

