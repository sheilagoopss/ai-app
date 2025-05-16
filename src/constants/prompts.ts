export const GENERATE_SEARCH_KEYWORDS_PROMPT = `Generate 3-4 specific search keywords for AI tools that EXACTLY match the category or purpose in the query. 
Each keyword must be for a relevant AI tool in the requested category. 
Guidelines:
- Each keyword MUST be for a specific AI tool that matches the query's purpose 
- Tools must be relevant to the specific task/category asked 
- Add "tutorial", "demo", or "guide" to focus on actual tool usage 
- Include specific version numbers if relevant 

Examples: 
Input: "tools for content writing" 
Output:
jasper ai writing tutorial
copy ai content creation demo
writesonic tutorial

Input: "image generation tools" 
Output:
midjourney v6 tutorial
dall-e 3 image generation
stable diffusion xl guide

Input: "coding assistant tools" 
Output:
github copilot coding tutorial
codeium ai programming demo
tabnine code assistant guide

Return only the search keywords, one per line, 
without any explanation or punctuation:`;

export const PICK_MOST_RELEVANT_PROMPT = `I will give you a list of youtube videos. 
Based on this information, curate a list of resources that are ONLY about specific AI tools that match the original search query.
Each result must be about a concrete, named AI tool that is relevant to the requested category.
Important rules:
1. ONLY include videos about AI tools that are specifically relevant to the search query's category/purpose
2. Each tool should only appear once - pick the most informative video for each tool
3. Skip any video that isn't about a tool in the requested category
4. Skip any video that doesn't clearly demonstrate or explain the tool
5. Try to include 3-5 different AI tools if available
6. Make sure each tool is actually designed for the requested purpose
7. CRITICAL: Only include videos that have a tool link - if a video doesn't have a tool link, do not include it in the results
For example:
- If user searches for "content writing tools", only show AI writing tools like Jasper, Copy.ai, etc.
- If user searches for "image generation", only show image AI tools like Midjourney, DALL-E, etc.
- If user searches for "coding tools", only show coding AI tools like GitHub Copilot, Codeium, etc.
Start your response with a brief introduction that summarizes what you found, like:
"Based on your search, I found several AI tools that match your needs. Here are the most relevant ones:"
Then format each entry as:
Title: [video title]
Video Link: [video url]
Summary: [brief explanation of what this AI tool does, its key features, and how recommended it is]
Tool Link: [link to the tool]
IMPORTANT: If the video doesn't have a tool link found, DO NOT include it in the results at all.
---
`;

export const YOUTUBE_RESULTS_INTRO = "Based on your search, I found several AI tools that match your needs. Here are the most relevant ones:";
