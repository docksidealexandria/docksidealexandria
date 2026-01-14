import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.json();
  const { booking, guest } = body;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: guest.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Dockside Alexandria – Reservation Deposit"
          },
          unit_amount: 50000
        },
        quantity: 1
      }
    ],
    metadata: {
      check_in: booking.from,
      check_out: booking.to,
      total_price: booking.pricing.total,
      guest_name: `${guest.first} ${guest.last}`,
      phone: guest.phone
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/reserve`
  });

  return Response.json({ url: session.url });
}
