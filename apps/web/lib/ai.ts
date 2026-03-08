import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function generateReply(productContext: string, threadContent: string) {
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
}

export async function generateQueries(productDescription: string) {
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
}
