import { auth, currentUser } from "@clerk/nextjs/server";
import { apiSuccess, apiError } from "@/lib/utils/response";
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN || "",
});

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) return apiError(new Error("Unauthorized"), 401);

    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;
    if (userEmail !== "thecxsmic@gmail.com") {
      return apiError(new Error("Forbidden: Admin access required"), 403);
    }

    const rs = await client.execute("SELECT id, title, custom_url, thumbnail, statistics FROM channels ORDER BY title ASC");
    const channels = rs.rows.map(row => ({
      id: row.id,
      title: row.title,
      custom_url: row.custom_url,
      thumbnail: row.thumbnail,
      statistics: JSON.parse(row.statistics || "{}")
    }));

    return apiSuccess({ channels });
  } catch (error) {
    console.error("[Admin Channels API] Error:", error);
    return apiError(error);
  }
}
