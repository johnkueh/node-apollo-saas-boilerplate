const Stripe = jest.genMockFromModule('stripe');

Stripe.mocks = {
  customers: {
    create: jest.fn().mockResolvedValue({
      id: 'cust_234'
    }),
    update: jest.fn().mockResolvedValue({
      token: 'tok_234',
      customerId: 'cust_234'
    })
  },
  subscriptions: {
    create: jest.fn().mockResolvedValue({
      planId: 'annual_premium',
      customerId: 'cust_234'
    })
  }
};

Stripe.mockImplementation(() => Stripe.mocks);

export default Stripe;
