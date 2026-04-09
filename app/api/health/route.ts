import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return Response.json({ status: "ok", db: "connected" });
  } catch (err) {
    return Response.json(
      { status: "error", db: "disconnected", detail: String(err) },
      { status: 503 }
    );
  }
}
