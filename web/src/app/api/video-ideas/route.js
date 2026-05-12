import { generateObject } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";
import { NextResponse } from "next/server";
import { apiSuccess, apiError } from "@/lib/utils/response";

// Define the schema for video ideas
const videoIdeasSchema = z.object({
  ideas: z.array(z.object({
    title: z.string().describe('Catchy, clickable video title that matches channel style'),
    description: z.string().describe('Detailed description explaining why this idea would work for this specific channel'),
    category: z.string().describe('Video category (Tutorial, Review, Challenge, Vlog, Gaming, etc.)'),
    estimatedViews: z.string().describe('Estimated view range based on channel performance (e.g., "10K-25K") with confidence percentage'),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']).describe('Production difficulty level'),
    trending: z.boolean().describe('Whether this topic is currently trending'),
    tags: z.array(z.string()).describe('Relevant hashtags/keywords (max 5)'),
    targetAudience: z.string().describe('Specific audience segment this video targets'),
    bestPostTime: z.string().describe('Recommended posting time/day for maximum reach'),
    contentFormat: z.string().describe('Recommended format (Short-form, Long-form, Live, etc.)')
  }))
})

export async function POST(request) {
  try {
    const { channelId, channelData } = await request.json();

    if (!channelId && !channelData) {
      return apiError(new Error("Channel ID or Channel Data is required"), 400);
    }

    let channelInfo = channelData;

    // If channel data not provided, fetch it
    if (!channelInfo) {
      const channelResponse = await fetch(`${request.nextUrl.origin}/api/youtube/channel?channelId=${channelId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!channelResponse.ok) {
        throw new Error('Failed to fetch channel data');
      }

      const channelResult = await channelResponse.json();
      
      if (!channelResult.success) {
        throw new Error(channelResult.error || 'Failed to get channel information');
      }

      // Map our pipeline response to what the generator expects
      channelInfo = {
        channel: channelResult.channel,
        recentVideos: channelResult.videos.map(v => ({
          ...v,
          viewCount: parseInt(v.statistics?.viewCount || 0),
          likeCount: parseInt(v.statistics?.likeCount || 0),
          commentCount: parseInt(v.statistics?.commentCount || 0)
        }))
      };
    }

    const channel = channelInfo.channel;
    const recentVideos = channelInfo.recentVideos || [];

    // Calculate advanced analytics
    const analytics = calculateChannelAnalytics(channel, recentVideos);

    // Create comprehensive context for AI
    const channelContext = `
CHANNEL PROFILE ANALYSIS:
Channel Name: ${channel.title}
Subscriber Count: ${parseInt(channel.statistics?.subscriberCount || 0).toLocaleString()}
Total Videos: ${channel.statistics?.videoCount || 0}
Total Views: ${parseInt(channel.statistics?.viewCount || 0).toLocaleString()}
Channel Description: ${channel.description?.substring(0, 500) || 'No description available'}...

PERFORMANCE METRICS:
Average Views per Video: ${analytics.avgViewsPerVideo.toLocaleString()}
Average Engagement Rate: ${analytics.avgEngagementRate}%
Most Successful Content Type: ${analytics.topContentType}
Best Performing Video: "${analytics.bestVideo?.title}" (${analytics.bestVideo?.viewCount?.toLocaleString()} views)
Upload Frequency: ${analytics.uploadFrequency}
View Growth Trend: ${analytics.growthTrend}

RECENT VIDEO PERFORMANCE (Last ${recentVideos.length} videos):
${recentVideos.slice(0, 10).map((video, i) => 
  `${i + 1}. "${video.title}" - ${video.viewCount.toLocaleString()} views, ${video.likeCount || 0} likes, ${video.commentCount || 0} comments`
).join('\n')}

CONTENT PATTERNS DETECTED:
- Video Length Preference: ${analytics.preferredLength}
- Popular Topics: ${analytics.popularTopics.join(', ')}
- Posting Schedule: ${analytics.postingPattern}
- Audience Engagement: ${analytics.audienceEngagement}
- Content Style: ${analytics.contentStyle}
    `;

    const currentDate = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    const prompt = `You are an advanced YouTube content strategist AI with deep expertise in viral content creation and audience psychology. 

Based on this comprehensive channel analysis, generate 6 highly personalized, data-driven video ideas that are specifically tailored to THIS channel's unique audience, style, and performance patterns.

${channelContext}

STRATEGIC GUIDELINES:
1. ANALYZE THE DATA: Study the channel's top-performing content patterns, audience engagement style, and growth trajectory
2. MATCH THE VOICE: Ensure ideas align with the channel's established tone, style, and brand identity
3. LEVERAGE STRENGTHS: Build on what's already working well for this channel
4. CURRENT TRENDS: Consider ${currentMonth} 2026 trends and seasonal opportunities
5. REALISTIC PROJECTIONS: Base view estimates on actual channel performance data, not generic ranges
6. AUDIENCE-FIRST: Consider what THIS specific audience wants to see next
7. GROWTH STRATEGY: Mix content types - some for retention, some for growth, some for monetization

CONTENT MIX REQUIREMENTS:
- 2 ideas that build on the channel's proven successful formats
- 2 ideas that could attract new audiences while staying true to the brand
- 2 experimental ideas that could become new series or viral content

For each idea, consider:
- How it fits the channel's established content style
- Why THIS audience would click and watch
- Production feasibility
- Potential for series/follow-up content
- Monetization opportunities

Generate ideas that feel like natural next steps for this channel's growth journey.`;

    const { object } = await generateObject({
      model: groq('openai/gpt-oss-120b'),
      schema: videoIdeasSchema,
      prompt,
      temperature: 0.7,
    });

    // Add personalization score to each idea
    const personalizedIdeas = object.ideas.map(idea => ({
      ...idea,
      personalizationScore: calculatePersonalizationScore(idea, analytics),
      channelFit: assessChannelFit(idea, channel, analytics)
    }));

    return apiSuccess({
      ideas: personalizedIdeas,
      channelAnalytics: analytics,
      generationContext: {
        channelId,
        channelName: channel.title,
        analysisDate: new Date().toISOString(),
        videosAnalyzed: recentVideos.length
      }
    });

  } catch (error) {
    console.error('Error generating video ideas with Groq:', error);
    
    // Return enhanced fallback ideas if AI fails
    return apiError(error, 500);
  }
}

// Helper function to calculate advanced channel analytics
function calculateChannelAnalytics(channel, recentVideos) {
  const totalViews = recentVideos.reduce((sum, video) => sum + (video.viewCount || 0), 0);
  const totalLikes = recentVideos.reduce((sum, video) => sum + (video.likeCount || 0), 0);
  const totalComments = recentVideos.reduce((sum, video) => sum + (video.commentCount || 0), 0);
  
  const avgViewsPerVideo = recentVideos.length > 0 ? Math.round(totalViews / recentVideos.length) : 0;
  const avgEngagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews * 100).toFixed(2) : 0;
  
  // Find best performing video
  const bestVideo = recentVideos.reduce((best, current) => 
    (current.viewCount || 0) > (best?.viewCount || 0) ? current : best, null
  );
  
  // Analyze content patterns
  const videoTitles = recentVideos.map(v => v.title.toLowerCase());
  const commonWords = extractCommonWords(videoTitles);
  
  // Determine upload frequency
  const uploadDates = recentVideos
    .filter(v => v.published_at)
    .map(v => new Date(v.published_at))
    .sort((a, b) => b - a);
    
  const daysBetween = uploadDates.length > 1 ? 
    (uploadDates[0] - uploadDates[uploadDates.length - 1]) / (1000 * 60 * 60 * 24) / (uploadDates.length - 1) : 0;
  
  const uploadFrequency = daysBetween === 0 ? 'Unknown' :
                         daysBetween < 2 ? 'Daily' : 
                         daysBetween < 4 ? 'Every 2-3 days' :
                         daysBetween < 8 ? 'Weekly' : 'Less than weekly';
  
  return {
    avgViewsPerVideo,
    avgEngagementRate,
    bestVideo,
    topContentType: determineContentType(videoTitles),
    uploadFrequency,
    growthTrend: calculateGrowthTrend(recentVideos),
    preferredLength: 'Mixed lengths',
    popularTopics: commonWords.slice(0, 5),
    postingPattern: analyzePostingPattern(uploadDates),
    audienceEngagement: avgEngagementRate > 5 ? 'High' : avgEngagementRate > 2 ? 'Medium' : 'Low',
    contentStyle: analyzeContentStyle(videoTitles, channel.description || '')
  };
}

// Helper functions
function extractCommonWords(titles) {
  const words = titles.join(' ').split(/\s+/);
  const frequency = {};
  const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'how', 'what', 'why', 'when', 'where', 'who', 'i', 'you', 'my', 'this', 'that', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'a', 'an'];
  
  words.forEach(word => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord.length > 3 && !stopWords.includes(cleanWord)) {
      frequency[cleanWord] = (frequency[cleanWord] || 0) + 1;
    }
  });
  
  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}

function determineContentType(titles) {
  const types = {
    tutorial: ['tutorial', 'how', 'guide', 'tips', 'learn'],
    review: ['review', 'test', 'vs', 'comparison', 'best'],
    vlog: ['vlog', 'day', 'life', 'routine', 'daily'],
    gaming: ['gaming', 'gameplay', 'game', 'play', 'stream'],
    reaction: ['reaction', 'reacting', 'responds', 'react']
  };
  
  let maxCount = 0;
  let topType = 'General';
  
  Object.entries(types).forEach(([type, keywords]) => {
    const count = titles.reduce((sum, title) => {
      return sum + keywords.reduce((keywordSum, keyword) => {
        return keywordSum + (title.includes(keyword) ? 1 : 0);
      }, 0);
    }, 0);
    
    if (count > maxCount) {
      maxCount = count;
      topType = type.charAt(0).toUpperCase() + type.slice(1);
    }
  });
  
  return topType;
}

function calculateGrowthTrend(videos) {
  if (videos.length < 4) return 'Stable';
  
  const mid = Math.ceil(videos.length / 2);
  const recent = videos.slice(0, mid);
  const older = videos.slice(mid);
  
  const recentAvg = recent.reduce((sum, v) => sum + (v.viewCount || 0), 0) / recent.length;
  const olderAvg = older.reduce((sum, v) => sum + (v.viewCount || 0), 0) / older.length;
  
  if (olderAvg === 0) return 'Growing';
  const growth = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  if (growth > 20) return 'Strong Growth';
  if (growth > 5) return 'Growing';
  if (growth > -5) return 'Stable';
  return 'Declining';
}

function analyzePostingPattern(dates) {
  if (dates.length < 3) return 'Irregular';
  
  const days = dates.map(d => d.getDay());
  const dayCount = days.reduce((count, day) => {
    count[day] = (count[day] || 0) + 1;
    return count;
  }, {});
  
  const sortedDays = Object.entries(dayCount).sort(([,a], [,b]) => b - a);
  const mostCommonDay = sortedDays[0];
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return `Often posts on ${dayNames[mostCommonDay[0]]}`;
}

function analyzeContentStyle(titles, description) {
  const allText = (titles.join(' ') + ' ' + description).toLowerCase();
  
  if (allText.includes('tutorial') || allText.includes('learn') || allText.includes('how')) {
    return 'Educational';
  } else if (allText.includes('funny') || allText.includes('comedy') || allText.includes('laugh')) {
    return 'Entertainment';
  } else if (allText.includes('review') || allText.includes('analysis') || allText.includes('comparison')) {
    return 'Analytical';
  } else if (allText.includes('vlog') || allText.includes('life') || allText.includes('daily')) {
    return 'Lifestyle';
  } else {
    return 'Mixed';
  }
}

function calculatePersonalizationScore(idea, analytics) {
  let score = 0.5;
  if (idea.category.toLowerCase() === analytics.topContentType.toLowerCase()) score += 0.2;
  if (idea.trending && analytics.growthTrend === 'Declining') score += 0.2;
  return Math.min(score + (Math.random() * 0.2), 1.0).toFixed(2);
}

function assessChannelFit(idea, channel, analytics) {
  const reasons = [];
  if (idea.category.toLowerCase() === analytics.topContentType.toLowerCase()) reasons.push('Matches proven content type');
  if (idea.trending && analytics.growthTrend !== 'Strong Growth') reasons.push('Potential for growth boost');
  return reasons.length > 0 ? reasons.join(', ') : 'Good general fit';
}

export async function GET() {
  return NextResponse.json({ 
    error: 'Method not allowed. Use POST to generate video ideas.' 
  }, { status: 405 });
}
