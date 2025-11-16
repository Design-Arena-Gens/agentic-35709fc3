import pdf from "pdf-parse";
import { summarizeToBullets } from "@/lib/summarize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!file) {
      return new Response("No file uploaded", { status: 400 });
    }
    if (typeof file.arrayBuffer !== "function") {
      return new Response("Invalid file", { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());

    // Parse text from PDF
    const result = await pdf(buf);
    const text = (result.text || "").trim();
    if (!text) {
      return new Response(JSON.stringify({ bullets: [] }), {
        headers: { "content-type": "application/json" },
      });
    }

    // Summarize to bullet points
    const bullets = summarizeToBullets(text, 30);

    return new Response(JSON.stringify({ bullets }), {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error("/api/extract error", err);
    return new Response("Failed to process PDF", { status: 500 });
  }
}
