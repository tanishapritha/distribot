import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Clock,
  Bot,
  BarChart2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { joinWaitlist } from "@/actions/waitlist";
import { SignInButton, Show } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0B] text-[#FAFAFA]">

      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-[#0A0A0B]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-sm font-semibold tracking-tight">Distribot</span>
          </div>
          <nav className="flex items-center gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white text-xs">
                  Sign In
                </Button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <Button asChild size="sm" variant="ghost" className="text-zinc-400 hover:text-white text-xs">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </Show>
            <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs rounded-md font-medium">
              <Link href="#waitlist">Request Access</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="pt-28 pb-20 text-center px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-700 bg-zinc-900/60 text-xs font-mono text-amber-500 tracking-wider">
              EARLY ACCESS — INVITE ONLY
            </div>

            <h1 className="text-5xl lg:text-6xl text-white leading-tight tracking-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Your product, in every<br />conversation that matters.
            </h1>

            <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Distribot monitors Reddit, Hacker News, and X for high-intent posts — then drafts perfectly timed, non-spammy replies, ready to paste.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white px-6 h-10 rounded-md text-sm font-medium gap-2">
                <Link href="#waitlist">
                  Request Early Access <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-zinc-700 hover:border-zinc-500 text-zinc-300 px-6 h-10 rounded-md text-sm font-medium bg-transparent gap-2">
                <Link href="/dashboard">
                  View Demo <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="text-xs text-zinc-600">Used by 200+ indie founders. No spam.</p>
          </div>

          {/* HERO MOCKUP */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="border border-zinc-700 rounded-xl overflow-hidden bg-[#111113] shadow-2xl">
              {/* Fake browser chrome */}
              <div className="border-b border-zinc-800 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-zinc-700" />
                  <span className="w-3 h-3 rounded-full bg-zinc-700" />
                  <span className="w-3 h-3 rounded-full bg-zinc-700" />
                </div>
                <span className="text-xs font-mono text-zinc-600 ml-2">app.distribot.co/opportunities</span>
              </div>
              {/* Fake table preview */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800 pb-3">
                  <span>Platform</span>
                  <span className="ml-16">Thread</span>
                  <span>Score</span>
                  <span>Action</span>
                </div>
                {[
                  { platform: "Reddit", sub: "r/SaaS", thread: "Looking for a tool to track customer sentiment across forums", score: "High", scoreColor: "text-green-400" },
                  { platform: "HN", sub: "ask-hn", thread: "How do you find early B2B customers beyond cold outreach?", score: "High", scoreColor: "text-green-400" },
                  { platform: "Reddit", sub: "r/startups", thread: "What are founders using to stay visible in communities?", score: "Medium", scoreColor: "text-amber-400" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-zinc-800/50 text-sm">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${row.platform === "Reddit" ? "bg-orange-950/60 text-orange-400" : "bg-amber-950/60 text-amber-400"}`}>
                      {row.platform}
                    </span>
                    <div className="flex-1 mx-6">
                      <p className="text-zinc-200 text-sm truncate max-w-sm">{row.thread}</p>
                      <p className="text-xs text-zinc-600 font-mono mt-0.5">{row.sub}</p>
                    </div>
                    <span className={`text-xs font-medium mr-6 ${row.scoreColor}`}>{row.score}</span>
                    <button className="text-xs bg-amber-600/20 text-amber-400 border border-amber-600/30 rounded-md px-3 py-1 hover:bg-amber-600 hover:text-white transition-colors">
                      Generate Reply
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM STRIP */}
        <section className="border-t border-b border-zinc-800 bg-[#111113] py-12">
          <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Manual Monitoring",
                desc: "Hours wasted scanning forums for relevant threads that match your product."
              },
              {
                icon: Bot,
                title: "Generic Replies",
                desc: "AI tools that sound robotic and get ignored or flagged by community moderators."
              },
              {
                icon: BarChart2,
                title: "Zero Tracking",
                desc: "No visibility into what interactions are converting to signups or revenue."
              }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  <item.icon className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <p className="text-xs uppercase tracking-widest text-amber-500 font-medium mb-2">How it works</p>
              <h2 className="text-3xl font-semibold text-white">Three steps to consistent presence</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  num: "01",
                  title: "Connect your product",
                  desc: "Add your URL, product description, and target audience. Done in under 2 minutes."
                },
                {
                  num: "02",
                  title: "Discover opportunities",
                  desc: "Distribot scans platforms for you. High-intent threads surface automatically, ranked by relevance."
                },
                {
                  num: "03",
                  title: "Reply with confidence",
                  desc: "One click generates a contextual, human-sounding reply. You review, refine, paste, and post."
                }
              ].map((step, i) => (
                <div key={i}>
                  <div className="text-6xl font-bold text-zinc-800 leading-none mb-4">{step.num}</div>
                  <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="py-12 px-6 border-t border-zinc-800">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {[
              {
                quote: "We cut our community outreach time from 3 hours a day to about 20 minutes. The reply quality is genuinely scary good.",
                author: "Marcus T.",
                product: "Founder, Logboard.io"
              },
              {
                quote: "I was skeptical about AI replies feeling human. Distribot threads context in a way I didn't expect. My community trust score actually went up.",
                author: "Priya S.",
                product: "CEO, HireStack"
              }
            ].map((q, i) => (
              <div key={i} className="border-l-2 border-amber-600 pl-5 py-2 bg-[#111113] border border-l-2 border-solid rounded-lg p-5">
                <p className="text-sm text-zinc-300 leading-relaxed mb-4">"{q.quote}"</p>
                <div>
                  <p className="text-xs font-semibold text-white">{q.author}</p>
                  <p className="text-xs text-zinc-500">{q.product}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WAITLIST CTA */}
        <section id="waitlist" className="py-20 px-6 border-t border-zinc-800 bg-[#111113]">
          <div className="max-w-lg mx-auto text-center space-y-4">
            <h2 className="text-2xl font-semibold text-white">Join the waitlist</h2>
            <p className="text-sm text-zinc-400">Early access is limited. We onboard in batches to ensure quality support.</p>

            <form action={joinWaitlist as any} className="flex flex-col sm:flex-row gap-2 mt-6">
              <Input
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                className="flex-1 h-10 bg-zinc-900 border-zinc-700 focus:border-amber-600 focus:ring-0 rounded-md text-sm placeholder:text-zinc-600"
              />
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white h-10 px-5 rounded-md text-sm font-medium gap-2 shrink-0">
                Request Access <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-zinc-600">We don't sell your data. No pitch emails.</p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-semibold text-zinc-400">Distribot</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Privacy</Link>
            <Link href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
