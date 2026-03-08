"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus, Loader2, Zap, Copy, RotateCcw, X } from "lucide-react";
import { createAIReply } from "@/actions/replies";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function ReplyButton({ opportunityId }: { opportunityId: string }) {
    const [loading, setLoading] = useState(false);
    const [reply, setReply] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    async function handleGenerate() {
        setLoading(true);
        try {
            const res = await createAIReply(opportunityId);
            setReply(res.text);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-none h-10 w-10 border border-border/10 hover:border-primary/20 hover:bg-primary/5 transition-all text-muted-foreground/40 hover:text-primary">
                    <MessageSquarePlus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] rounded-none border-border p-0 gap-0 overflow-hidden bg-background shadow-2xl">
                <div className="absolute top-0 right-0 p-4 z-50">
                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-8 w-8 rounded-none opacity-40 hover:opacity-100 border border-transparent hover:border-border/10">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <DialogHeader className="p-8 border-b border-border/10 bg-primary/[0.01]">
                    <div className="flex flex-col gap-2">
                        <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-primary font-bold">
                            <Zap className="h-3 w-3" />
                            AI Generation
                        </div>
                        <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter">Draft Reply.</DialogTitle>
                    </div>
                </DialogHeader>

                <div className="p-8 space-y-8 bg-background relative overflow-hidden">
                    {!reply ? (
                        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border/10 space-y-8 bg-primary/[0.01]">
                            <div className="w-16 h-16 border border-border/10 flex items-center justify-center rotate-45 transition-all duration-700">
                                <MessageSquarePlus className={`h-8 w-8 text-primary/30 -rotate-45 ${loading ? 'animate-pulse' : ''}`} />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">Target: Signal_{opportunityId.slice(0, 8)}</p>
                                <p className="text-[12px] font-medium text-muted-foreground max-w-xs leading-relaxed italic">The AI will draft a helpful, non-spammy response based on your product details.</p>
                            </div>
                            <Button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="rounded-none h-14 px-12 bg-primary text-primary-foreground hover:opacity-90 font-bold uppercase tracking-widest text-[10px] border border-primary/20 shadow-lg active:scale-[0.98] transition-all"
                            >
                                {loading && <Loader2 className="mr-3 h-4 w-4 animate-spin italic" />}
                                {loading ? 'Writing...' : 'Generate AI Reply'}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex items-center justify-between font-mono text-[9px] font-bold uppercase tracking-widest text-primary mb-[-1rem]">
                                <span>Draft Result</span>
                                <span className="italic">Status: Ready</span>
                            </div>
                            <Textarea
                                className="min-h-[300px] rounded-none border-border/20 bg-primary/[0.02] p-6 font-medium text-sm leading-relaxed resize-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 placeholder:opacity-40 italic transition-all focus:bg-background h-auto overflow-y-auto"
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className="p-8 pt-0 flex flex-col sm:flex-row gap-4 border-t-0 bg-background relative z-10">
                    {reply && (
                        <div className="flex gap-4 w-full h-14">
                            <Button
                                variant="outline"
                                onClick={() => setReply(null)}
                                className="rounded-none px-6 h-full border-border/10 hover:border-primary/20 hover:bg-primary/5 font-bold uppercase tracking-widest text-[9px] gap-3"
                            >
                                <RotateCcw className="h-3.5 w-3.5 italic" />
                                Try Again
                            </Button>
                            <Button
                                onClick={() => {
                                    navigator.clipboard.writeText(reply);
                                    setOpen(false);
                                }}
                                className="flex-1 rounded-none h-full bg-primary text-primary-foreground hover:opacity-90 font-bold uppercase tracking-widest text-[10px] shadow-xl group active:scale-[0.98] transition-all"
                            >
                                <Copy className="mr-3 h-4 w-4 italic group-hover:scale-110 transition-transform" />
                                Copy to Clipboard
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
