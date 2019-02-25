import models, { sequelize } from './db/models';
import { createCustomer } from './services/stripe';

const test = async () => {
  const stripeCustomerId = await createCustomer({ email: 'john@beaconmaker.com' });
  console.log(stripeCustomerId);
  // const user = await models.user.create({ email: 'test@stripe.com' });
};

test().then(() => {
  console.log('creatd');
});
