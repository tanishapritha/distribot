"use server"

import { db, replies } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createAIReply(opportunityId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Mock AI generation for now if Groq is not configured
    const mockReply = "This looks like a great opportunity for your product! Have you considered how our solution addresses this specific pain point? Happy to chat more.";

    try {
        const [newReply] = await db.insert(replies).values({
            opportunityId,
            text: mockReply,
            status: 'draft',
        }).returning();

        revalidatePath("/dashboard/replies");
        return newReply;
    } catch (e) {
        console.warn("DB not connected — returning mock reply without saving", e);
        return { text: mockReply, status: 'draft' };
    }
}

export async function updateReplyStatus(replyId: string, status: 'posted' | 'copied') {
    try {
        await db.update(replies).set({ status }).where(eq(replies.id, replyId));
        revalidatePath("/dashboard/replies");
    } catch (e) {
        console.error("Failed to update reply status", e);
    }
}
