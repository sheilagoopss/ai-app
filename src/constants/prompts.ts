export const GENERATE_SEARCH_KEYWORDS_PROMPT = `Generate 3-4 specific search terms that will help find AI tools for the given category. 
Focus on the specific use case or task, not specific tool names.

Guidelines:
- Be specific about the task/use case
- Include relevant technical terms
- Add "tutorial" or "demo" to find practical examples
- Focus on finding tools that solve the specific problem
- ALWAYS include "ai" or "artificial intelligence" in each search term
- Make sure each term is focused on finding AI tools, not general tools


Return only the search terms, one per line, without any explanation or punctuation:`;

export const PICK_MOST_RELEVANT_PROMPT = `I will give you a list of youtube videos about AI tools. 
Based on this information, curate a list of resources that are most relevant to the provided user query.  
Do not include resources that do not directly describe relevant AI tools.

Present this as a list of tools, each with a link to a video and a short explanation of what it does and how recommended is it.

Results:

{results}
`;

export const YOUTUBE_RESULTS_INTRO = "מצאתי מספר כלי בינה מלאכותית שמתאימים לצרכים שלך. הנה הרלוונטיים ביותר:";
