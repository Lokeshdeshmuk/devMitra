export const generateCodeComments = async (code: string) => {
  const KEY = import.meta.env.VITE_API_KEY;
  const URL = import.meta.env.VITE_API_BASE_URl;

  const trimmed = code.trim();
  const lowerCode = trimmed.toLowerCase();

  // Instruction keywords indicating natural language requests
  const instructionKeywords = [
    "create",
    "make",
    "build",
    "write",
    "design",
    "develop",
    "generate",
    "code for",
    "how to",
    "explain",
    "describe",
    "show me",
    "give me",
  ];

  // Symbols common in code
  const codeSymbols = /[{}();=<>[\]]/g;

  // Count total characters and code symbols
  const totalChars = trimmed.length;
  const codeSymbolMatches = trimmed.match(codeSymbols);
  const codeSymbolCount = codeSymbolMatches ? codeSymbolMatches.length : 0;

  // Calculate ratio of code symbols to total chars
  const codeSymbolRatio = totalChars > 0 ? codeSymbolCount / totalChars : 0;

  // Check for presence of instruction keywords
  const hasInstructionKeywords = instructionKeywords.some((keyword) =>
    lowerCode.includes(keyword),
  );

  // Check if input looks like a code snippet based on codeSymbolRatio threshold
  const looksLikeCode = codeSymbolRatio > 0.05; // Adjust threshold as needed

  if (hasInstructionKeywords && !looksLikeCode) {
    return `// ⚠️ This tool is intended only for code formatting and commenting.\n// Please provide valid source code to generate comments.`;
  }

  if (!looksLikeCode) {
    // Also block very short or symbol-poor inputs
    return `// ⚠️ This tool is intended only for code formatting and commenting.\n// Please provide valid source code to generate comments.`;
  }

  // Proceed with API call if input looks like code
  const prompt = `
You are a senior software engineer and technical writer.
Your task: Add professional, helpful comments explaining the code and its logic.
Rules:
- Use JSDoc-style block comments for functions, classes, and modules.
- Add clear inline comments where code logic is complex.
- Explain the purpose, behavior, inputs, and outputs as relevant.
- Use the appropriate comment style for the language.
- Do NOT alter or reformat the original code.
- Do NOT wrap response in markdown fences.
- Output ONLY the commented code.
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
        { role: "user", content: code },
      ],
      temperature: 0,
      max_tokens: 50000,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Perplexity API Error: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content.trim();
};
