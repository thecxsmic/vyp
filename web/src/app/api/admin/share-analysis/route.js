import { auth, currentUser } from "@clerk/nextjs/server";
import { apiSuccess, apiError } from "@/lib/utils/response";
import { fetchYouTubeChannels, fetchChannelVideos } from "@/lib/youtube/channels";
import { saveChannel } from "@/lib/cache/turso";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return apiError(new Error("Unauthorized"), 401);

    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;
    if (userEmail !== "thecxsmic@gmail.com") {
      return apiError(new Error("Forbidden: Admin access required"), 403);
    }

    const { query } = await req.json();
    if (!query) {
      return apiError(new Error("Query (Channel ID or handle) is required"), 400);
    }

    console.log(`[Admin Share API] Generating shareable analysis for query: ${query}`);

    // 1. Fetch channel from YouTube
    const channels = await fetchYouTubeChannels(query);
    if (!channels || channels.length === 0) {
      return apiError(new Error("Channel not found on YouTube"), 404);
    }
    const youtubeChannel = channels[0];

    // 2. Fetch recent videos
    console.log(`[Admin Share API] Fetching videos for channel: ${youtubeChannel.id}`);
    const { items: youtubeVideos } = await fetchChannelVideos(youtubeChannel.id, 50);

    // 3. Save channel and videos to local database
    await saveChannel(youtubeChannel, youtubeVideos);
    console.log(`[Admin Share API] Successfully saved channel and ${youtubeVideos?.length || 0} videos to DB`);

    return apiSuccess({
      success: true,
      channelId: youtubeChannel.id,
      title: youtubeChannel?.snippet?.title || youtubeChannel?.title || "Unknown Channel"
    });
  } catch (error) {
    console.error("[Admin Share API] Error:", error);
    return apiError(error);
  }
}
