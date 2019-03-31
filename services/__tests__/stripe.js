import Stripe from 'stripe';
import {
  createCustomer,
  createCard,
  createSubscription,
  listAllInvoices,
  handleWebhook
} from '../stripe';

beforeEach(() => {
  process.env.STRIPE_SECRET_KEY = 'MOCK-KEY';
});

it('creates customer and returns a customer id', async () => {
  const id = await createCustomer({
    name: 'John',
    email: 'john@doe.com'
  });
  expect(Stripe.mocks.customers.create).toHaveBeenCalledWith({
    name: 'John',
    email: 'john@doe.com'
  });
  expect(id).toEqual('cust_234');
});

it('updates customer with token', async () => {
  const resp = await createCard({
    token: 'cust_token',
    customerId: 'cust_234'
  });
  expect(Stripe.mocks.customers.update).toHaveBeenCalledWith('cust_234', {
    source: 'cust_token'
  });
  expect(resp).toEqual({
    token: 'tok_234',
    customerId: 'cust_234'
  });
});

it('subscribes customer to a plan', async () => {
  const resp = await createSubscription({
    customerId: 'cust_234',
    planId: 'annual_premium'
  });
  expect(Stripe.mocks.subscriptions.create).toHaveBeenCalledWith({
    customer: 'cust_234',
    items: [{ plan: 'annual_premium' }]
  });
  expect(resp).toEqual({
    planId: 'annual_premium',
    customerId: 'cust_234'
  });
});

it('lists all invoices for a customer', async () => {
  const resp = await listAllInvoices({
    customerId: 'cust_234'
  });
  expect(Stripe.mocks.invoices.list).toHaveBeenCalledWith({
    customer: 'cust_234'
  });
  expect(resp).toEqual([
    {
      amount_due: 20,
      amount_paid: 20,
      invoice_pdf: 'https://stripe.com/invoice',
      status: 'paid',
      date: new Date(2018, 8, 8),
      period_start: new Date(2018, 8, 8),
      period_end: new Date(2018, 9, 8)
    }
  ]);
});

const mockData = {
  object: {
    customer: 'cust_123',
    current_period_end: '08/09/18',
    current_period_start: '08/08/18'
  }
};

const mockRes = {
  sendStatus: jest.fn()
};

const mockHandleUpdated = jest.fn();

it('runs callback on customer subscription deleted webhook', () => {
  const mockReq = {
    body: JSON.stringify({
      type: 'customer.subscription.deleted',
      data: mockData
    })
  };

  handleWebhook({
    req: mockReq,
    res: mockRes,
    handleSubscriptionUpdated: mockHandleUpdated
  });

  expect(mockRes.sendStatus).toHaveBeenCalledWith(200);
  expect(mockHandleUpdated).toHaveBeenCalledWith({
    customerId: mockData.object.customer,
    periodStart: mockData.object.current_period_start,
    periodEnd: mockData.object.current_period_end
  });
});

it('runs callback on customer subscription created webhook', () => {
  const mockReq = {
    body: JSON.stringify({
      type: 'customer.subscription.created',
      data: mockData
    })
  };

  handleWebhook({
    req: mockReq,
    res: mockRes,
    handleSubscriptionUpdated: mockHandleUpdated
  });

  expect(mockRes.sendStatus).toHaveBeenCalledWith(200);
  expect(mockHandleUpdated).toHaveBeenCalledWith({
    customerId: mockData.object.customer,
    periodStart: mockData.object.current_period_start,
    periodEnd: mockData.object.current_period_end
  });
});

it('runs callback on customer subscription updated webhook', () => {
  const mockReq = {
    body: JSON.stringify({
      type: 'customer.subscription.updated',
      data: mockData
    })
  };

  handleWebhook({
    req: mockReq,
    res: mockRes,
    handleSubscriptionUpdated: mockHandleUpdated
  });

  expect(mockRes.sendStatus).toHaveBeenCalledWith(200);
  expect(mockHandleUpdated).toHaveBeenCalledWith({
    customerId: mockData.object.customer,
    periodStart: mockData.object.current_period_start,
    periodEnd: mockData.object.current_period_end
  });
});
