import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { SidebarNav } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import { auth } from "@/lib/auth";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <SidebarNav />
        <div className="flex w-full flex-1 flex-col">
          <TopBar userName={session.user?.name} />
          <main className="flex-1 space-y-8 px-4 py-6 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
