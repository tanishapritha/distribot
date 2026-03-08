"use client"

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowRight, X, Plus } from "lucide-react";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────────────────── */
type Platform = 'reddit' | 'hn';
type Tone = 'conversational' | 'direct' | 'technical';
type Style = 'subtle' | 'clear';

const CATEGORY_OPTIONS = [
    { emoji: "🤖", label: "AI Tool" },
    { emoji: "📣", label: "Marketing" },
    { emoji: "🛠️", label: "Developer Tool" },
    { emoji: "💼", label: "Sales & CRM" },
    { emoji: "📋", label: "Productivity" },
    { emoji: "🎨", label: "Design" },
    { emoji: "💰", label: "Finance" },
    { emoji: "🛒", label: "E-commerce" },
    { emoji: "🏥", label: "Health & Wellness" },
    { emoji: "🌐", label: "Social & Community" },
    { emoji: "📚", label: "Education" },
    { emoji: "⚙️", label: "Other" },
];

const CUSTOMER_OPTIONS = [
    "Founders & Startups",
    "Developers",
    "Small Businesses",
    "Enterprise",
    "Consumers / General Public",
];

const SUBREDDIT_SUGGESTIONS = [
    "SaaS", "entrepreneur", "startups", "SideProject", "webdev", "indiehackers", "smallbusiness"
];

/* ─── Optional Badge ──────────────────────────────────────────────── */
function OptionalBadge() {
    return (
        <span className="text-xs bg-zinc-800 text-zinc-500 rounded px-1.5 py-0.5 font-normal ml-2 select-none">
            Optional
        </span>
    );
}

/* ─── Field Wrapper ───────────────────────────────────────────────── */
function Field({ children }: { children: React.ReactNode }) {
    return <div className="space-y-2">{children}</div>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="flex items-center text-sm font-medium text-zinc-200 leading-none">
            {children}
        </label>
    );
}

function FieldHint({ children }: { children: React.ReactNode }) {
    return <p className="text-xs text-zinc-500 -mt-1">{children}</p>;
}

/* ─── Toggle Button ───────────────────────────────────────────────── */
function ToggleButton({
    active,
    onClick,
    children,
    className = "",
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`border rounded-md px-3 py-2 text-sm transition-all duration-150 text-left
        ${active
                    ? "border-amber-600 bg-amber-600/10 text-amber-400"
                    : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                } ${className}`}
        >
            {children}
        </button>
    );
}

/* ─── Tag Input ───────────────────────────────────────────────────── */
function TagInput({
    value,
    onChange,
}: {
    value: string[];
    onChange: (tags: string[]) => void;
}) {
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    function addTag(raw: string) {
        const tag = raw.trim().replace(/^r\//, "");
        if (!tag || value.includes(tag)) return;
        onChange([...value, tag]);
        setInput("");
    }

    function removeTag(tag: string) {
        onChange(value.filter((t) => t !== tag));
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(input);
        }
        if (e.key === "Backspace" && !input && value.length > 0) {
            removeTag(value[value.length - 1]);
        }
    }

    return (
        <div className="space-y-3">
            {/* Input */}
            <div
                className="flex flex-wrap gap-2 min-h-[42px] p-2 bg-zinc-900 border border-zinc-700 rounded-md focus-within:border-amber-600 transition-colors cursor-text"
                onClick={() => inputRef.current?.focus()}
            >
                {value.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-zinc-800 border border-amber-600/60 rounded-full px-3 py-0.5 text-xs text-amber-400"
                    >
                        r/{tag}
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                            className="text-zinc-500 hover:text-white transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={value.length === 0 ? "Type a subreddit, hit Enter" : ""}
                    className="flex-1 min-w-[140px] bg-transparent text-sm text-white outline-none placeholder:text-zinc-600 py-0.5"
                />
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2">
                {SUBREDDIT_SUGGESTIONS.filter((s) => !value.includes(s)).map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => addTag(s)}
                        className="inline-flex items-center gap-1 bg-zinc-800 border border-zinc-700 rounded-full px-3 py-0.5 text-xs text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors"
                    >
                        <Plus className="h-2.5 w-2.5" /> r/{s}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ─── Main Page ───────────────────────────────────────────────────── */
export default function OnboardingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Q1
    const [name, setName] = useState("");
    // Q2
    const [description, setDescription] = useState("");
    // Q3
    const [productUrl, setProductUrl] = useState("");
    // Q4
    const [category, setCategory] = useState<string | null>(null);
    // Q5
    const [customerType, setCustomerType] = useState<string | null>(null);
    // Q6
    const [platforms, setPlatforms] = useState<Platform[]>(["reddit", "hn"]);
    // Q7
    const [subreddits, setSubreddits] = useState<string[]>([]);
    // Q8
    const [replyTone, setReplyTone] = useState<Tone>("conversational");
    // Q9
    const [replyStyle, setReplyStyle] = useState<Style>("subtle");

    const showSubreddits = platforms.includes("reddit");

    function togglePlatform(p: Platform) {
        setPlatforms((prev) => {
            if (prev.includes(p)) {
                const next = prev.filter((x) => x !== p);
                // Never leave empty — revert to both
                return next.length === 0 ? ["reddit", "hn"] : next;
            }
            return [...prev, p];
        });
    }

    async function submit(skipAll = false) {
        setLoading(true);
        setError(null);
        try {
            await createProject(
                skipAll
                    ? {}
                    : {
                        name: name || undefined,
                        description: description || undefined,
                        productUrl: productUrl || undefined,
                        category: category || undefined,
                        customerType: customerType || undefined,
                        platforms: platforms.length > 0 ? platforms : ["reddit", "hn"],
                        subreddits: subreddits.length > 0 ? subreddits : undefined,
                        replyTone,
                        replyStyle,
                    }
            );
            router.push("/dashboard/opportunities");
        } catch (e: any) {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B] px-4 py-12">
            <div className="max-w-lg mx-auto">

                {/* Wordmark */}
                <div className="flex items-center gap-2 mb-8">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-sm font-semibold text-white">Distribot</span>
                </div>

                {/* Page header */}
                <h1 className="text-xl font-semibold text-white">Set up your project</h1>
                <p className="text-sm text-zinc-400 mt-1 mb-8">
                    Takes under 2 minutes. You can edit this anytime in Settings.
                </p>

                {/* Card */}
                <div className="bg-[#111113] border border-zinc-800 rounded-xl p-6 space-y-6">

                    {/* Q1 — Product Name */}
                    <Field>
                        <FieldLabel>
                            What's your product called?
                            <OptionalBadge />
                        </FieldLabel>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. ResumeAI"
                            className="bg-zinc-900 border-zinc-700 focus:border-amber-600 focus:ring-0 rounded-md text-sm h-10 text-white placeholder:text-zinc-600"
                        />
                    </Field>

                    {/* Divider */}
                    <div className="border-t border-zinc-800/60" />

                    {/* Q2 — Description */}
                    <Field>
                        <FieldLabel>
                            What does it do? <span className="text-zinc-500 font-normal ml-1">(one sentence)</span>
                            <OptionalBadge />
                        </FieldLabel>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Helps job seekers create ATS-optimised resumes using AI in under 5 minutes."
                            rows={2}
                            className="bg-zinc-900 border-zinc-700 focus:border-amber-600 focus:ring-0 rounded-md text-sm text-white resize-none p-3 placeholder:text-zinc-600"
                        />
                        <FieldHint>
                            The AI uses this to write replies. Be specific — vague descriptions produce generic replies.
                        </FieldHint>
                    </Field>

                    <div className="border-t border-zinc-800/60" />

                    {/* Q3 — URL */}
                    <Field>
                        <FieldLabel>
                            Your product URL
                            <OptionalBadge />
                        </FieldLabel>
                        <Input
                            type="url"
                            value={productUrl}
                            onChange={(e) => setProductUrl(e.target.value)}
                            placeholder="https://yourproduct.com"
                            className="bg-zinc-900 border-zinc-700 focus:border-amber-600 focus:ring-0 rounded-md text-sm h-10 text-white font-mono placeholder:text-zinc-600"
                        />
                    </Field>

                    <div className="border-t border-zinc-800/60" />

                    {/* Q4 — Category */}
                    <Field>
                        <FieldLabel>
                            What category is your product?
                            <OptionalBadge />
                        </FieldLabel>
                        <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                            {CATEGORY_OPTIONS.map((opt) => (
                                <ToggleButton
                                    key={opt.label}
                                    active={category === opt.label}
                                    onClick={() => setCategory(category === opt.label ? null : opt.label)}
                                >
                                    <span className="mr-1.5">{opt.emoji}</span>
                                    {opt.label}
                                </ToggleButton>
                            ))}
                        </div>
                    </Field>

                    <div className="border-t border-zinc-800/60" />

                    {/* Q5 — Customer type */}
                    <Field>
                        <FieldLabel>
                            Who are your customers?
                            <OptionalBadge />
                        </FieldLabel>
                        <div className="flex flex-wrap gap-2">
                            {CUSTOMER_OPTIONS.map((opt) => (
                                <ToggleButton
                                    key={opt}
                                    active={customerType === opt}
                                    onClick={() => setCustomerType(customerType === opt ? null : opt)}
                                >
                                    {opt}
                                </ToggleButton>
                            ))}
                        </div>
                    </Field>

                    <div className="border-t border-zinc-800/60" />

                    {/* Q6 — Platforms */}
                    <Field>
                        <FieldLabel>
                            Where should we look for opportunities?
                            <OptionalBadge />
                        </FieldLabel>
                        <FieldHint>Select all that apply</FieldHint>
                        <div className="flex flex-wrap gap-2">
                            {(["reddit", "hn"] as Platform[]).map((p) => (
                                <ToggleButton
                                    key={p}
                                    active={platforms.includes(p)}
                                    onClick={() => togglePlatform(p)}
                                >
                                    {p === "reddit" ? "🟠 Reddit" : "🟡 Hacker News"}
                                </ToggleButton>
                            ))}
                        </div>
                    </Field>

                    {/* Q7 — Subreddits (conditional, animated) */}
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${showSubreddits ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                            }`}
                    >
                        <div className="border-t border-zinc-800/60 mb-6" />
                        <Field>
                            <FieldLabel>
                                Which subreddits should we monitor?
                                <OptionalBadge />
                            </FieldLabel>
                            <FieldHint>
                                We'll also auto-suggest more based on your product.
                            </FieldHint>
                            <TagInput value={subreddits} onChange={setSubreddits} />
                        </Field>
                    </div>

                    <div className="border-t border-zinc-800/60" />

                    {/* Q8 — Reply tone */}
                    <Field>
                        <FieldLabel>
                            How should replies sound?
                            <OptionalBadge />
                        </FieldLabel>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { value: "conversational" as Tone, label: "Conversational & Helpful" },
                                { value: "direct" as Tone, label: "Direct & Confident" },
                                { value: "technical" as Tone, label: "Technical & Precise" },
                            ].map((opt) => (
                                <ToggleButton
                                    key={opt.value}
                                    active={replyTone === opt.value}
                                    onClick={() => setReplyTone(opt.value)}
                                >
                                    {opt.label}
                                </ToggleButton>
                            ))}
                        </div>
                    </Field>

                    <div className="border-t border-zinc-800/60" />

                    {/* Q9 — Mention style */}
                    <Field>
                        <FieldLabel>
                            How prominently should replies mention your product?
                            <OptionalBadge />
                        </FieldLabel>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { value: "subtle" as Style, label: "Subtle — help first, mention naturally" },
                                { value: "clear" as Style, label: "Clear — mention product and benefit directly" },
                            ].map((opt) => (
                                <ToggleButton
                                    key={opt.value}
                                    active={replyStyle === opt.value}
                                    onClick={() => setReplyStyle(opt.value)}
                                >
                                    {opt.label}
                                </ToggleButton>
                            ))}
                        </div>
                    </Field>

                    {/* Submit */}
                    <div className="pt-2 space-y-4">
                        <Button
                            onClick={() => submit(false)}
                            disabled={loading}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 h-auto rounded-md text-sm gap-2 disabled:opacity-60"
                        >
                            {loading ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Setting up...</>
                            ) : (
                                <>Save & Start Discovering <ArrowRight className="h-4 w-4" /></>
                            )}
                        </Button>

                        {error && (
                            <p className="text-xs text-red-400 text-center">{error}</p>
                        )}

                        <p className="text-sm text-zinc-500 text-center">
                            Rather explore first?{" "}
                            <button
                                type="button"
                                onClick={() => submit(true)}
                                disabled={loading}
                                className="text-zinc-400 underline underline-offset-2 hover:text-zinc-200 transition-colors disabled:opacity-50"
                            >
                                Skip setup →
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
