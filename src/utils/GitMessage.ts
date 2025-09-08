export const generateCommitMessage = async (input: string) => {
  const KEY = import.meta.env.VITE_API_KEY;
  const URL = import.meta.env.VITE_API_BASE_URl;
  const prompt = `
You are a Git commit expert.
Convert developer notes into clean Git commit messages using Conventional Commits.
- Output ONLY the commit messages, no explanations or formatting.
- If multiple changes exist, generate one commit per line.
- Allowed types: feat, fix, refactor, chore, docs, style, test.
- Example: feat(auth): add login API
`;

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar-pro",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: input },
      ],
      temperature: 0,
      max_tokens: 200,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Perplexity API Error: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content.trim();
};
