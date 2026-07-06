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
        <title>{title} | Inventory Pro</title>
        <meta name="description" content="Inventory Management System Dashboard" />
      </Head>
      <div className="min-h-screen bg-[#eef6f3] text-slate-950 dark:bg-slate-950 dark:text-slate-100">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:pl-72">
          <Topbar
            onMenuClick={() => setSidebarOpen(true)}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode((value) => !value)}
          />
          <main className="mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </>
  );
}
