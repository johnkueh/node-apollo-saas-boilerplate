import { msg } from './sendgrid';

beforeEach(() => {
  process.env = {
    SENDGRID_API_KEY: 'MOCK-KEY'
  };
});

test('msg calls .send with the message on a SendGrid mail service', () => {});
