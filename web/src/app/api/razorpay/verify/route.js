import { NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN || "",
});

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      razorpay_subscription_id,
      is_subscription 
    } = body;

    let expectedSignature;
    if (is_subscription) {
      expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_payment_id + "|" + razorpay_subscription_id)
        .digest("hex");
    } else {
      expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");
    }

    if (expectedSignature === razorpay_signature) {
      if (is_subscription) {
        // 7 days trial + 30 days first period roughly
        const trialEnd = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) + (30 * 24 * 60 * 60);

        // Immediate update for better UX (webhook will also run)
        await client.execute({
          sql: `INSERT OR REPLACE INTO user_subscriptions (user_id, subscription_id, plan_id, status, current_period_end, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)`,
          args: [
            userId,
            razorpay_subscription_id,
            process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID,
            "active",
            trialEnd,
            Math.floor(Date.now() / 1000)
          ],
        });
      }
      return NextResponse.json({ success: true, message: "Payment verified successfully" });
    }
 else {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Razorpay Verification Error:", error);
    return NextResponse.json(
      { error: "Internal server error during payment verification" },
      { status: 500 }
    );
  }
}
