'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0B] text-zinc-400 p-8 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
            <p className="text-sm max-w-md mb-6">
                The application encountered an error. This is likely due to missing environment variables (DB/Auth) during the initial deployment phase.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="px-4 py-2 bg-amber-600 text-white rounded-md text-sm hover:bg-amber-700 transition-colors"
                >
                    Try again
                </button>
                <a
                    href="/"
                    className="px-4 py-2 border border-zinc-700 text-zinc-300 rounded-md text-sm hover:border-zinc-500 transition-colors"
                >
                    Go home
                </a>
            </div>
        </div>
    )
}
