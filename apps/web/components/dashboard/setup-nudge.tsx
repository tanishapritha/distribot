"use client"

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export function SetupNudgeBanner({ incomplete }: { incomplete: boolean }) {
    const [dismissed, setDismissed] = useState(false);

    if (!incomplete || dismissed) return null;

    return (
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-amber-600/10 border border-amber-600/30 rounded-lg text-sm">
            <p className="text-amber-400">
                <span className="font-medium">Your setup is incomplete</span>
                {" — "}replies may be generic.{" "}
                <Link
                    href="/dashboard/settings"
                    className="underline underline-offset-2 hover:text-amber-300 transition-colors"
                >
                    Complete your project profile →
                </Link>
            </p>
            <button
                onClick={() => setDismissed(true)}
                className="shrink-0 text-amber-600 hover:text-amber-400 transition-colors"
                aria-label="Dismiss"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
