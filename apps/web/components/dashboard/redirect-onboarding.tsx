"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function RedirectToOnboarding() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/dashboard/onboarding");
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-center">
            <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
            <p className="text-sm text-zinc-500">Setting up your workspace...</p>
        </div>
    );
}
