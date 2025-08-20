import { GoogleGenerativeAI } from "@google/generative-ai";
const GEMINI_API_KEY = "AIzaSyCkQFRErSwsOuWVPM9Is-_-6A3QBK5Ao2Y";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const generateCommitMessage = async (input: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
You are a Git commit expert.
Your only job is to convert developer update notes into one or more well-structured Git commit messages using the Conventional Commits format.

✅ Task Rules:
- Analyze the input and understand all meaningful actions.
- If multiple types (feat, fix, refactor, chore, etc.) are present, generate separate commit messages for each.
- Use clear and relevant scopes like auth, ui, form, role, employee, etc.
- Do NOT merge unrelated changes into a single message.
- Each message must be a single line — no line breaks or bullet points.
- Output ONLY the final commit messages — no explanations, markdown, or formatting.
- Sort commits by type priority: feat > fix > refactor > chore.

❌ Input Rejection:
If the input contains unrelated requests (e.g., questions, image prompts, instructions), 
or If the input:Is vague, subjective feedback or opinions (e.g., "its bad ui", "looks ugly")
Is not a clear, actionable developer update or change log Contains questions, requests for explanations, or unrelated topics respond with:❌ This tool only accepts developer updates to generate Git commit messages. Please provide relevant change logs.

User input: ${input}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
};
