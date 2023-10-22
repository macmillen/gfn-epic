import type { APIRoute } from "astro";
import { ZodError, z, type SafeParseReturnType } from "zod";
import clientPromise from "../utils/mongodb";

export const prerender = false;

const schema = z.object({
  feedbackText: z.string().min(10).max(3000),
  option: z.enum(["General", "Idea", "Issue"]),
});

export type FeedbackSchema = z.infer<typeof schema>;
export type FeedbackError = ZodError<FeedbackSchema>;
export type FeedbackResponse = SafeParseReturnType<
  FeedbackSchema,
  FeedbackSchema
>;

export const post: APIRoute = async ({ request }) => {
  const feedback = (await request.json()) as unknown;

  const result = schema.safeParse(feedback);

  const client = await clientPromise;
  const collection = client.db("main").collection("feedback");

  if (result.success) await collection.insertOne(result.data);

  return { body: JSON.stringify(result) };
};

export const GET: APIRoute = async () => {
  const client = await clientPromise;
  const collection = client.db("main").collection("feedback");

  const allFeedback = await collection.find({}).toArray();

  return new Response(
    `<pre><code>${JSON.stringify(allFeedback.reverse(), null, 2)}</code></pre>`,
    {
      headers: { "Content-Type": "text/html" },
    }
  );
};
