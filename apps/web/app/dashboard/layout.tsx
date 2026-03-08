import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
    LayoutDashboard,
    Radar,
    MessageSquare,
    BarChart2,
    Settings,
} from "lucide-react";
import { getAuthSafe } from "@/lib/auth-safe";
import { redirect } from "next/navigation";
import { SetupNudgeBanner } from "@/components/dashboard/setup-nudge";

export const dynamic = 'force-dynamic';

const sidebarNavItems = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Opportunities",
        href: "/dashboard/opportunities",
        icon: Radar,
    },
    {
        title: "Replies",
        href: "/dashboard/replies",
        icon: MessageSquare,
    },
    {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart2,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await getAuthSafe();
    if (!userId && process.env.CLERK_SECRET_KEY) redirect("/");

    return (
        <div className="flex min-h-screen bg-[#0A0A0B] text-[#FAFAFA]">
            {/* Dashboard Nudge – Show only if we have a userId but setup is incomplete */}
            {userId && <SetupNudgeBanner incomplete={true} />}
            {/* SIDEBAR */}
            <aside className="hidden md:flex w-[220px] flex-col border-r border-zinc-800 bg-[#0A0A0B] fixed inset-y-0 left-0 z-30">
                {/* Logo */}
                <div className="h-[52px] flex items-center px-5 border-b border-zinc-800 shrink-0">
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <span className="w-2 h-2 rounded-full bg-amber-500 group-hover:bg-amber-400 transition-colors" />
                        <span className="text-sm font-semibold tracking-tight text-white">Distribot</span>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-3 space-y-0.5">
                    {sidebarNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group flex items-center gap-3 px-3 py-2 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 transition-all text-sm relative"
                        >
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span>{item.title}</span>
                        </Link>
                    ))}
                </nav>

                {/* User */}
                <div className="border-t border-zinc-800 p-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-7 h-7 rounded-md",
                                }
                            }}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-zinc-400 truncate">Your account</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN */}
            <div className="flex-1 md:ml-[220px] flex flex-col min-h-screen">
                {/* TOP BAR */}
                <header className="h-[52px] border-b border-zinc-800 flex items-center px-8 shrink-0 sticky top-0 z-20 bg-[#0A0A0B]">
                    <div className="flex-1" />
                    <div className="flex items-center gap-4">
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-7 h-7 rounded-md",
                                }
                            }}
                        />
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="flex-1 px-8 py-6 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
