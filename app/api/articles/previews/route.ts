import { NextResponse } from "next/server";
import { getArticlePreviews } from "../../../../src/lib/articlePreviews";

export async function GET() {
  try {
    const previews = getArticlePreviews();
    return NextResponse.json(previews);
  } catch (error) {
    console.error("Error building article previews:", error);
    return NextResponse.json([]);
  }
}
