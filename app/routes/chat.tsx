import { generateText } from "../lib/textGen.server";
import { ActionFunctionArgs, json } from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  ClientActionFunctionArgs,
  Form,
  useLoaderData,
} from "@remix-run/react";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const message = formData.get("message");
  if (!message || typeof message !== "string") {
    return json({ error: "Message is required" }, { status: 400 });
  }
  const systemPrompt = "You are a helpful assistant.";
  const messageResponse = await generateText({
    prompt: message,
    systemPrompt,
  });

  return json({
    message: messageResponse,
  });
}

export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  console.log("clientLoader");
  const lastResponse = localStorage.getItem("lastResponse");
  return { lastResponse: lastResponse || "" };
}

clientLoader.hydrate = true;

export async function clientAction({
  request,
  serverAction,
}: ClientActionFunctionArgs) {
  const result = await serverAction<typeof action>();
  if ("message" in result) {
    localStorage.setItem("lastResponse", result.message || "");
  }
  return result;
}

export default function Chat() {
  const { lastResponse } = useLoaderData<typeof clientLoader>();
  console.log("Chat");
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Chat
        </h1>

        {lastResponse && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{lastResponse}</p>
          </div>
        )}

        <Form method="post" className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              name="message"
              className="flex-1 min-w-0 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Send
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
