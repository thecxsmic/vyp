import { config } from "dotenv";
config({ path: ".env.local" });
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function listPlans() {
  try {
    const plans = await razorpay.plans.all();
    console.log("Recent Plans:");
    plans.items.slice(0, 5).forEach(p => {
        console.log(`- ${p.id}: ${p.item.name} (${p.item.amount} ${p.item.currency})`);
    });
  } catch (error) {
    console.error("Error listing plans:", error);
  }
}

listPlans();
