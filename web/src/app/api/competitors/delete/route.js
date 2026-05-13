import { auth } from "@clerk/nextjs/server";
import { deleteAnalysis } from "@/lib/cache/turso";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return apiError(new Error("Unauthorized"), 401);

    const { analysisId } = await req.json();
    if (!analysisId) {
      return apiError(new Error("Analysis ID is required"), 400);
    }

    const result = await deleteAnalysis(userId, analysisId);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}
