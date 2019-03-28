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
  },
  invoices: {
    list: jest.fn().mockResolvedValue({
      data: [
        {
          amount_due: 20,
          amount_paid: 20,
          invoice_pdf: 'https://stripe.com/invoice',
          status: 'paid',
          date: new Date(2018, 8, 8),
          period_start: new Date(2018, 8, 8),
          period_end: new Date(2018, 9, 8)
        }
      ]
    })
  }
};

Stripe.mockImplementation(() => Stripe.mocks);

export default Stripe;
