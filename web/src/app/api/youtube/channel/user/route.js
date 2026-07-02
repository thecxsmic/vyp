import { auth, currentUser } from "@clerk/nextjs/server";
import { setUserChannel, getUserChannel, unsetUserChannel, getChannel, saveChannel, getCache, setCache } from "@/lib/cache/turso";
import { fetchYouTubeChannels } from "@/lib/youtube/channels";
import { sendEmail } from "@/lib/email/resend";
import { apiSuccess, apiError } from "@/lib/utils/response";
import { getIsDemoMode, MOCK_CHANNELS } from "@/lib/utils/demoMock";

export async function GET(req) {
  try {
    if (await getIsDemoMode()) {
      return apiSuccess({ channel: MOCK_CHANNELS["UC-techvibeai123"] });
    }

    const { userId } = await auth();
    if (!userId) return apiError(new Error("Unauthorized"), 401);

    const userChannel = await getUserChannel(userId);
    return apiSuccess({ channel: userChannel });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(req) {
  try {
    if (await getIsDemoMode()) {
      return apiSuccess({ success: true });
    }

    const { userId } = await auth();
    if (!userId) return apiError(new Error("Unauthorized"), 401);

    const { channelId, action, channelName } = await req.json();

    if (action === 'verify-remove') {
      if (!channelName) {
        return apiError(new Error("Channel name confirmation is required"), 400);
      }

      const userChannel = await getUserChannel(userId);
      if (!userChannel) {
        return apiError(new Error("No channel is connected to this account"), 404);
      }

      if (channelName.trim().toLowerCase() !== userChannel.title.trim().toLowerCase()) {
        return apiError(new Error("The entered name does not match your connected channel's name."), 400);
      }

      const result = await unsetUserChannel(userId);
      return apiSuccess(result);
    }

    if (action === 'unset') {
      return apiError(new Error("2-step verification is required to remove a channel."), 400);
    }

    if (!channelId) return apiError(new Error("Channel ID is required"), 400);

    // Ensure the channel exists in the database to prevent FOREIGN KEY constraint failure
    const existing = await getChannel(channelId);
    if (!existing) {
      const channels = await fetchYouTubeChannels(channelId);
      if (channels && channels.length > 0) {
        await saveChannel(channels[0]);
      } else {
        return apiError(new Error("Channel not found on YouTube"), 404);
      }
    }

    const result = await setUserChannel(userId, channelId);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

