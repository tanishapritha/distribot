"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const navSections = ["Project", "Integrations", "Account", "Billing"];

const integrations = [
    { name: "Reddit", status: "not_connected", icon: "🟠" },
    { name: "Hacker News", status: "connected", icon: "🟡" },
    { name: "X (Twitter)", status: "not_connected", icon: "⬛" },
];

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState("Project");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-lg font-semibold text-white">Settings</h1>
                <p className="text-sm text-zinc-500 mt-0.5">Manage your project and account preferences</p>
            </div>

            <div className="flex gap-6">
                {/* Left nav */}
                <nav className="w-44 shrink-0 space-y-0.5">
                    {navSections.map((section) => (
                        <button
                            key={section}
                            onClick={() => setActiveSection(section)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${activeSection === section
                                    ? "bg-zinc-900/60 text-white border-l-2 border-amber-600 pl-[10px]"
                                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                                }`}
                        >
                            {section}
                        </button>
                    ))}
                </nav>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {activeSection === "Project" && (
                        <div className="space-y-6">
                            <div className="bg-[#111113] border border-zinc-800 rounded-lg p-6 space-y-4">
                                <h2 className="text-sm font-semibold text-white">Project Details</h2>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Project Name</label>
                                    <Input
                                        defaultValue="My Project"
                                        className="bg-zinc-900 border-zinc-700 focus:border-amber-600 focus:ring-0 rounded-md text-sm h-10 text-white max-w-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Product URL</label>
                                    <Input
                                        defaultValue="https://yourproduct.com"
                                        className="bg-zinc-900 border-zinc-700 focus:border-amber-600 focus:ring-0 rounded-md text-sm h-10 text-white font-mono max-w-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Description</label>
                                    <Textarea
                                        defaultValue="Your product description..."
                                        rows={3}
                                        className="bg-zinc-900 border-zinc-700 focus:border-amber-600 focus:ring-0 rounded-md text-sm text-white resize-none p-3 max-w-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Target Audience</label>
                                    <Input
                                        defaultValue="Indie hackers, early-stage founders"
                                        className="bg-zinc-900 border-zinc-700 focus:border-amber-600 focus:ring-0 rounded-md text-sm h-10 text-white max-w-sm"
                                    />
                                </div>
                                <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium">
                                    Save Changes
                                </Button>
                            </div>

                            {/* Danger zone */}
                            <div className="border border-red-900/40 rounded-lg p-5">
                                <h3 className="text-sm font-semibold text-red-400 mb-1">Danger Zone</h3>
                                <p className="text-xs text-zinc-500 mb-4">
                                    Permanently delete this project and all associated data. This cannot be undone.
                                </p>
                                {!showDeleteConfirm ? (
                                    <Button
                                        variant="ghost"
                                        className="border border-red-900/60 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-md text-sm font-medium h-9 px-4"
                                        onClick={() => setShowDeleteConfirm(true)}
                                    >
                                        Delete Project
                                    </Button>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Button
                                            className="bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium h-9"
                                        >
                                            Confirm Delete
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="text-zinc-400 hover:text-zinc-200 rounded-md text-sm h-9"
                                            onClick={() => setShowDeleteConfirm(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeSection === "Integrations" && (
                        <div className="bg-[#111113] border border-zinc-800 rounded-lg p-6">
                            <h2 className="text-sm font-semibold text-white mb-4">Platform Integrations</h2>
                            <div className="space-y-3">
                                {integrations.map((integration) => (
                                    <div
                                        key={integration.name}
                                        className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{integration.icon}</span>
                                            <div>
                                                <p className="text-sm font-medium text-white">{integration.name}</p>
                                                <p className="text-xs text-zinc-500 mt-0.5 capitalize">
                                                    {integration.status === "connected" ? "Connected" : "Not connected"}
                                                </p>
                                            </div>
                                        </div>
                                        {integration.status === "connected" ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 rounded-md text-xs h-7 px-3 bg-transparent"
                                            >
                                                Disconnect
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                className="bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs h-7 px-3 font-medium"
                                            >
                                                Connect
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {(activeSection === "Account" || activeSection === "Billing") && (
                        <div className="bg-[#111113] border border-zinc-800 rounded-lg p-6 text-center py-12">
                            <p className="text-sm text-zinc-500">
                                {activeSection} settings coming soon.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
