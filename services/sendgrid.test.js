import sgMail from '@sendgrid/mail';
import msg from './sendgrid';

jest.mock('@sendgrid/mail');

beforeEach(() => {
  process.env.SENDGRID_API_KEY = 'MOCK-KEY';
});

test('msg calls .send with the message on a SendGrid mail service', () => {
  msg('Hello there');
  expect(sgMail.setApiKey).toHaveBeenCalledWith('MOCK-KEY');
  expect(sgMail.send).toHaveBeenCalledWith('Hello there');
});
