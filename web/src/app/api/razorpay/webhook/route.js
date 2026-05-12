import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN || "",
});

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature (optional but highly recommended)
    if (secret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);
    const payload = event.payload;

    // We care about subscription events
    if (event.event.startsWith("subscription.")) {
      const subscription = payload.subscription.entity;
      const userId = subscription.notes?.user_id;

      if (userId) {
        await client.execute({
          sql: `INSERT OR REPLACE INTO user_subscriptions (user_id, subscription_id, plan_id, status, current_period_end, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)`,
          args: [
            userId,
            subscription.id,
            subscription.plan_id,
            subscription.status,
            subscription.current_end || 0,
            Math.floor(Date.now() / 1000)
          ],
        });
        console.log(`[Webhook] Updated subscription for user ${userId}: ${subscription.status}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
