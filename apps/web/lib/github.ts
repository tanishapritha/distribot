import axios from "axios";

export async function fetchGithubProject(repoUrl: string, accessToken: string) {
    // Extract owner and repo from URL
    const parts = repoUrl.replace("https://github.com/", "").split("/");
    const owner = parts[0];
    const repo = parts[1];

    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });

        const readmeResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/readme`, {
            headers: {
                Authorization: `token ${accessToken}`,
                Accept: "application/vnd.github.v3.raw",
            },
        });

        return {
            name: response.data.name,
            description: response.data.description,
            productUrl: response.data.homepage || repoUrl,
            readme: readmeResponse.data,
            language: response.data.language,
        };
    } catch (e) {
        console.error("Github import error", e);
        throw e;
    }
}
