import Groq from "groq-sdk";

// Build-safe Groq client
const createGroqClient = () => {
    const apiKey = process.env.GROQ_API_KEY;

    // If we're during build and have no key, return placeholder to allow module loading
    if (!apiKey) {
        return new Groq({ apiKey: "gsk_test_placeholder_key_that_is_long_enough" });
    }

    return new Groq({ apiKey });
};

const groq = createGroqClient();

export async function generateReply(productContext: string, threadContent: string) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are helping a SaaS founder reply to a community thread.
Product description: ${productContext}
Write a helpful non-spammy reply. Mention the product naturally.`,
                },
                {
                    role: "user",
                    content: `Thread Content: ${threadContent}`,
                },
            ],
            model: "llama-3.1-70b-versatile",
        });

        return completion.choices[0]?.message?.content;
    } catch (e) {
        console.warn("Groq error — returning mock reply", e);
        return "This sounds like a great problem. Have you checked out our solution? It might help you save some time.";
    }
}

export async function generateQueries(productDescription: string) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Generate 5 search queries for Reddit and Hacker News for a SaaS with this description: ${productDescription}. Focus on problem-solving keywords and intent-based keywords. Return as a JSON array of strings.`,
                },
            ],
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) return [];
        const parsed = JSON.parse(content);
        return parsed.queries || [];
    } catch (e) {
        console.warn("Groq query generation failed — returning defaults", e);
        return ["saas", "startup", "founder", "software"];
    }
}
