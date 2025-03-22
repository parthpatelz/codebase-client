import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { prisma } from "@/libs/prismadb"; // Adjust the path to match your project structure

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).send("Missing the stripe signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return res.status(400).send("Webhook error: " + err);
  }

  switch (event.type) {
    case "charge.succeeded":
      const charge = event.data.object as Stripe.Charge;

      if (typeof charge.payment_intent === "string") {
        try {
          await prisma.order.update({
            where: { paymentIntentId: charge.payment_intent },
            data: { status: "complete", address: charge.shipping?.address },
          });
        } catch (err) {
          console.error("Error updating order:", err);
          return res.status(500).send("Internal Server Error");
        }
      }
      break;

    default:
      console.log("Unhandled event type: " + event.type);
  }

  res.json({ received: true });
}
