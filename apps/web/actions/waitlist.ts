"use server"

import { db, waitlist } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function joinWaitlist(formData: FormData) {
    const email = formData.get("email") as string;
    const productUrl = formData.get("product_url") as string;
    const category = formData.get("product_category") as string;

    if (!email) return { error: "Email is required" };

    try {
        await db.insert(waitlist).values({
            email,
            productUrl,
            category,
        });
        return { success: true };
    } catch (error: any) {
        if (error.message.includes("unique constraint")) {
            return { error: "You are already on the waitlist!" };
        }
        return { error: "Something went wrong. Please try again." };
    }
}
