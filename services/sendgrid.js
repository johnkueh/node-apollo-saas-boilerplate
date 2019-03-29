import sgMail from '@sendgrid/mail';

export default msg => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  return sgMail.send(msg);
};
