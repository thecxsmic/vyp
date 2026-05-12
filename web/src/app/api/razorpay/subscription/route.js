import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    const planId = process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID;

    if (!key_id || !key_secret || !planId) {
      console.error("[Razorpay] Missing configuration:", { key_id: !!key_id, key_secret: !!key_secret, planId });
      return NextResponse.json({ error: "Razorpay is not configured correctly on the server" }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    console.log(`[Razorpay] Creating subscription for user: ${userId}, Plan: ${planId}`);

    // 7 days from now (in seconds)
    const sevenDaysFromNow = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 12, // 1 year of billing cycles
      quantity: 1,
      customer_notify: 1,
      start_at: sevenDaysFromNow, // Trial ends after 7 days
      notes: {
        user_id: userId
      }
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Razorpay Subscription Error:", error);
    const message = error.error?.description || error.message || "Failed to create subscription";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
