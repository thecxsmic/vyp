import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, currency = "INR", receipt = "receipt_" + Date.now() } = body;

    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: "Amount must be at least 100 paise (1 INR)" },
        { status: 400 }
      );
    }

    const options = {
      amount: Math.round(amount), // amount in the smallest currency unit (paise)
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
