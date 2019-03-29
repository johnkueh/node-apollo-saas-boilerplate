import Stripe from 'stripe';

const stripe = () => new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCustomer = async args => {
  const customer = await stripe().customers.create(args);
  return customer.id;
};

export const createCard = async ({ token, customerId }) => {
  // To make test token: https://jsfiddle.net/9dxwaq5m/
  // Eg: tok_1E7LJ4ICatY1a4Wj8qKPv2u3
  return stripe().customers.update(customerId, {
    source: token
  });
};

export const createSubscription = async ({ customerId, planId }) => {
  // Get test planId from https://dashboard.stripe.com/test/subscriptions/products
  // Eg: plan_EaVtYitQ31qTPk
  return stripe().subscriptions.create({
    customer: customerId,
    items: [
      {
        plan: planId
      }
    ]
  });
};

export const listAllInvoices = async ({ customerId }) => {
  const res = await stripe().invoices.list({
    customer: customerId
  });
  return res.data;
};

export const handleWebhook = ({ req, res, handleSubscriptionUpdated }) => {
  const json = JSON.parse(req.body);
  const {
    customer: customerId,
    current_period_end: periodEnd,
    current_period_start: periodStart
  } = json.data.object;

  const period = {
    customerId,
    periodStart,
    periodEnd
  };

  switch (json.type) {
    case 'customer.subscription.deleted':
      handleSubscriptionUpdated(period);
      break;
    case 'customer.subscription.created':
      handleSubscriptionUpdated(period);
      break;
    case 'customer.subscription.updated':
      handleSubscriptionUpdated(period);
      break;
    default:
  }

  res.sendStatus(200);
};
