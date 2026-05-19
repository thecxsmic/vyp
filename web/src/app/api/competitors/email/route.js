import { auth, currentUser } from "@clerk/nextjs/server";
import { getAnalysisById, logEmail, getLastEmail } from "@/lib/cache/turso";
import { sendEmail } from "@/lib/email/resend";
import { apiSuccess, apiError } from "@/lib/utils/response";

export async function POST(req) {
  try {
    console.log("[Competitor Email API] Received request");
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId || !user) {
      console.error("[Competitor Email API] Unauthorized: No user or userId");
      return apiError(new Error("Unauthorized"), 401);
    }

    const { analysisId, email } = await req.json();
    console.log("[Competitor Email API] Analysis ID:", analysisId);
    
    if (!analysisId) return apiError(new Error("Analysis ID is required"), 400);

    // 1. Check 24h limit for this analysis
    const lastEmailTime = await getLastEmail(userId, 'competitor_analysis', analysisId);
    if (lastEmailTime) {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      if (now - lastEmailTime < oneDay) {
        const hoursLeft = Math.ceil((oneDay - (now - lastEmailTime)) / (60 * 60 * 1000));
        console.warn("[Competitor Email API] Limit hit. Hours left:", hoursLeft);
        return apiError(new Error(`You can only email this report once every 24 hours. Please wait ${hoursLeft} more hour${hoursLeft !== 1 ? 's' : ''}.`), 429);
      }
    }

    const analysis = await getAnalysisById(userId, analysisId);
    if (!analysis) {
      console.error("[Competitor Email API] Analysis not found in DB:", analysisId);
      return apiError(new Error("Analysis not found"), 404);
    }

    const targetEmail = email || user.emailAddresses[0]?.emailAddress;
    console.log("[Competitor Email API] Target Email:", targetEmail);
    
    if (!targetEmail) return apiError(new Error("No recipient email found"), 400);

    // Fetch full competitor details and recent videos from YouTube for the email content
    const apiKey = process.env.YOUTUBE_API_KEY;
    console.log("[Competitor Email API] Using YT API Key:", apiKey ? "Present" : "MISSING");
    
    const competitorsData = await Promise.all(
      analysis.competitor_ids.map(async (id) => {
        try {
          const cRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${id}&key=${apiKey}`);
          const cData = await cRes.json();
          const channel = cData.items?.[0];
          
          if (!channel) return null;

          // Fetch recent 3 videos
          const vRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${id}&order=date&type=video&maxResults=3&key=${apiKey}`);
          const vData = await vRes.json();
          const videos = vData.items || [];

          return { channel, videos };
        } catch (e) {
          console.error(`[Competitor Email API] Error fetching YT data for ${id}:`, e);
          return null;
        }
      })
    );

    const validData = competitorsData.filter(Boolean);
    console.log("[Competitor Email API] Valid competitors found:", validData.length);

    // Build Email Content
    const subject = `Your Competitor Report: ${analysis.title}`;
    
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #080808; color: white; padding: 40px; border-radius: 24px;">
        <h1 style="font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 8px;">Competitor Report</h1>
        <p style="color: #666; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 32px;">For ${analysis.subject_title || 'Your Channel'}</p>
        
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 14px; font-weight: 900; text-transform: uppercase; color: #00dfd8; margin-bottom: 16px;">Rival Stats</h2>
          ${validData.map(({ channel, videos }) => {
            const subCount = parseInt(channel.statistics.subscriberCount);
            const totalViews = parseInt(channel.statistics.viewCount);
            
            // Calculate avg views from recent videos if they have stats
            // Search API might not return statistics, so we might need a fallback
            // But usually we want to show something useful
            const avgViews = videos.length > 0 ? "Active" : "Stable";

            return `
              <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 16px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.05);">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                  <img src="${channel.snippet.thumbnails.default.url}" style="width: 40px; height: 40px; border-radius: 50%;" />
                  <div>
                    <p style="font-weight: 900; margin: 0; font-size: 16px;">${channel.snippet.title}</p>
                    <p style="font-size: 11px; color: #666; margin: 0;">${subCount.toLocaleString()} Subs • ${totalViews.toLocaleString()} Total Views</p>
                  </div>
                </div>
                
                <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                  <div style="background: rgba(0, 223, 216, 0.1); color: #00dfd8; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 900; text-transform: uppercase;">
                    ${subCount > 1000000 ? 'Market Leader' : subCount > 100000 ? 'Rising Star' : 'Niche Peer'}
                  </div>
                  <div style="background: rgba(255, 0, 85, 0.1); color: #ff0055; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 900; text-transform: uppercase;">
                    ${videos.length > 0 ? 'Recently Active' : 'Quiet'}
                  </div>
                </div>

                <p style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #444; margin-bottom: 8px; letter-spacing: 1px;">Recent Wins</p>
                ${videos.map(v => `
                  <div style="font-size: 13px; color: #ccc; margin-bottom: 6px; padding-left: 8px; border-left: 2px solid #00dfd8;">
                    ${v.snippet.title}
                  </div>
                `).join('')}
              </div>
            `;
          }).join('')}
        </div>

        <div style="background: rgba(255,255,255,0.05); padding: 24px; border-radius: 16px;">
          <h2 style="font-size: 14px; font-weight: 900; text-transform: uppercase; color: #ff0055; margin-bottom: 16px;">Your Next Steps</h2>
          <p style="font-size: 14px; color: #ccc; line-height: 1.6;">These channels are growing by posting content that your audience already likes. To win, you should look at their titles and make something better. They are currently filling gaps that you can target today.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://updates.vyron.space'}/competitors?analysisId=${analysisId}" style="display: inline-block; background: white; color: black; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 900; font-size: 12px; text-transform: uppercase; margin-top: 16px;">Open Full Matrix</a>
        </div>

        <p style="font-size: 10px; color: #444; margin-top: 40px; text-align: center;">Sent by Vyron</p>
      </div>
    `;

    console.log("[Competitor Email API] Sending via Resend...");
    const result = await sendEmail({
      to: targetEmail,
      subject,
      html
    });

    if (!result.success) {
      console.error("[Competitor Email API] Resend Error:", result.error);
      return apiError(new Error(result.error), 500);
    }

    console.log("[Competitor Email API] Success! Logging to DB...");
    // 2. Log the email send
    await logEmail(userId, 'competitor_analysis', analysisId);

    return apiSuccess({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("[Competitor Email API] Global Error:", error);
    return apiError(error);
  }
}
