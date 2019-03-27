import {
  createCustomer,
  createCard,
  createSubscription,
  listAllInvoices,
  handleWebhook
} from './stripe';

const stripe = require('stripe');

jest.mock('stripe');

const mockStripe = {
  customers: {
    create: jest.fn().mockResolvedValue({
      id: 'cust_234'
    }),
    update: jest.fn().mockResolvedValue({
      token: 'tok_234',
      customerId: 'cust_234'
    })
  }
};

stripe.mockImplementation(() => mockStripe);

beforeEach(() => {
  process.env.STRIPE_SECRET_KEY = 'MOCK-KEY';
});

it('creates customer and returns a customer id', async () => {
  const id = await createCustomer({
    name: 'John',
    email: 'john@doe.com'
  });
  expect(mockStripe.customers.create).toHaveBeenCalledWith({
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
  expect(mockStripe.customers.update).toHaveBeenCalledWith('cust_234', {
    source: 'cust_token'
  });
  expect(resp).toEqual({
    token: 'tok_234',
    customerId: 'cust_234'
  });
});

it.todo('subscribes customer to a plan');
it.todo('lists all invoices for a customer');
it.todo('runs callback on customer subscription deleted webhook');
it.todo('runs callback on customer subscription created webhook');
it.todo('runs callback on customer subscription updated webhook');
