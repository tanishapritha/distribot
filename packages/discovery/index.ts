export * from "./github";
import axios from "axios";

export async function findOpportunities(project: any) {
    const hnResults = await searchHackerNews(project.keywords || [project.name]);
    const redditResults = await searchReddit(project.keywords || [project.name]);

    return [...hnResults, ...redditResults].sort((a, b) => b.score - a.score);
}

async function searchHackerNews(queries: string[]) {
    const results: any[] = [];
    for (const query of queries) {
        try {
            const response = await axios.get(
                `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&numericFilters=created_at_i>${Math.floor(Date.now() / 1000) - 86400}`
            );

            response.data.hits.forEach((hit: any) => {
                results.push({
                    id: hit.objectID,
                    title: hit.title,
                    url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
                    platform: 'hn',
                    community: 'HN',
                    score: hit.points,
                    createdAt: new Date(hit.created_at),
                });
            });
        } catch (e) {
            console.error("HN search error", e);
        }
    }
    return results;
}

async function searchReddit(queries: string[]) {
    // Placeholder for Reddit API integration
    // Requires REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET
    // For MVP, if keys are missing, we return empty
    if (!process.env.REDDIT_CLIENT_ID) return [];

    // Real implementation would use oauth or a library like 'snoowrap'
    return [];
}
