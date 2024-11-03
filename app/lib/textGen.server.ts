import { ClientOptions, OpenAI } from "openai";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/index.mjs";

const defaultSystemPrompt = "You are a helpful assistant.";

export async function generateText({
  prompt,
  systemPrompt = defaultSystemPrompt,
  options,
  generateOptions,
}: {
  prompt: string;
  systemPrompt?: string;
  options?: ClientOptions;
  generateOptions?: Omit<ChatCompletionCreateParamsNonStreaming, "messages">;
}) {
  const openai = new OpenAI(options);
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    model: "gpt-4o-mini",
    ...generateOptions,
  });
  return completion.choices[0].message.content;
}
