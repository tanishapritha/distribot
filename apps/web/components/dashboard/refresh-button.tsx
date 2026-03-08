"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { runDiscoveryForUser } from "@/actions/opportunities";
import { useRouter } from "next/navigation";

export function RefreshOpportunitiesButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleRefresh() {
        setLoading(true);
        try {
            await runDiscoveryForUser();
            router.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            size="sm"
            className="border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white rounded-md text-sm font-medium gap-2 bg-transparent"
        >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Scanning...' : 'Run Scan'}
        </Button>
    );
}
