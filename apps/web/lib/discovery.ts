import axios from "axios";
import { generateQueries } from "./ai";

export async function findOpportunities(project: any) {
    // 1. Generate intelligent queries if keywords aren't specific
    let queries = project.keywords;
    if (!queries || queries.length === 0) {
        queries = await generateQueries(project.description);
    }
    // Always include the project name as a query
    if (!queries.includes(project.name)) {
        queries.push(project.name);
    }

    // 2. Search Hacker News
    const hnResults = await searchHackerNews(queries);

    // 3. Search Reddit (Placeholder still, until keys are provided)
    const redditResults = await searchReddit(queries);

    // 4. Combine and Sort
    return [...hnResults, ...redditResults].sort((a, b) => b.score - a.score);
}

async function searchHackerNews(queries: string[]) {
    const results: any[] = [];
    const seenIds = new Set();

    // We look for stories and comments from the last 48 hours for better coverage
    const timeLimit = Math.floor(Date.now() / 1000) - (48 * 60 * 60);

    for (const query of queries) {
        try {
            // Search Stories (Posts)
            const storyRes = await axios.get(
                `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&numericFilters=created_at_i>${timeLimit}`
            );

            // Search Comments
            const commentRes = await axios.get(
                `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=comment&numericFilters=created_at_i>${timeLimit}`
            );

            const allHits = [...storyRes.data.hits, ...commentRes.data.hits];

            allHits.forEach((hit: any) => {
                if (seenIds.has(hit.objectID)) return;
                seenIds.add(hit.objectID);

                // Basic scoring: HN Points + relevance bonus for titles
                let score = hit.points || 5; // Default 5 points for comments
                if (hit.title && hit.title.toLowerCase().includes(query.toLowerCase())) {
                    score += 10;
                }

                results.push({
                    id: hit.objectID,
                    title: hit.title || hit.comment_text?.substring(0, 100) + "...",
                    url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
                    platform: 'hn',
                    community: 'HN',
                    content: hit.comment_text || hit.story_text || "",
                    score: Math.min(score, 10), // Cap at 10 for our UI
                    createdAt: new Date(hit.created_at),
                });
            });
        } catch (e) {
            console.error(`HN search error for query "${query}":`, e);
        }
    }
    return results;
}

async function searchReddit(queries: string[]) {
    // Future Reddit implementation
    if (!process.env.REDDIT_CLIENT_ID) return [];
    return [];
}
