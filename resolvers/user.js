import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import sendEmail from '../services/sendgrid';
import {
  createCustomer,
  createCard,
  createSubscription,
  listAllInvoices
} from '../services/stripe';
import { identify } from '../services/segment';
import dbModels from '../db/models';
import { toCamelCase } from '../helpers/arrayUtils';

export default {
  Query: {
    async me(parent, args, { user, models }, info) {
      return getUserWithTeam(user.id);
    },
    async paymentHistory(parent, args, context, info) {
      const { stripeCustomerId: customerId } = context.user;
      const invoices = await listAllInvoices({
        customerId
      });

      return toCamelCase(invoices);
    }
  },
  Mutation: {
    async signup(parent, { firstName, lastName, email, password }, { models }, info) {
      const stripeCustomerId = await createCustomer({ email });

      const user = await models.user.create({
        firstName,
        lastName,
        email,
        stripeCustomerId,
        password: await hashedPassword(password)
      });

      if (process.env.SEGMENT_WRITE_KEY) {
        identify(user);
      }

      return getJwt({
        id: user.id,
        email: user.email
      });
    },
    async login(parent, { email, password }, { models }, info) {
      const user = await models.user.findOne({ where: { email } });

      if (user && (await bcrypt.compare(password, user.password))) {
        return getJwt({
          id: user.id,
          email: user.email
        });
      }

      throw new Error('Please check your credentials and try again.');
    },
    async forgotPassword(parent, { email }, { models }, info) {
      const user = await models.user.findOne({ where: { email } });
      if (user) {
        const { email: userEmail } = user;
        const token = await user.regeneratePasswordToken();

        sendEmail({
          template_id: process.env.FORGOT_PASSWORD_TEMPLATE_ID,
          to: userEmail,
          from: process.env.SUPPORT_EMAIL_ADDRESS,
          dynamic_template_data: {
            email: userEmail,
            resetPasswordLink: `https://app.zapcms.com/reset-password?token=${token}`
          }
        });
      }

      return {
        message: 'A link to reset your password will be sent to your registered email.'
      };
    },
    async resetPassword(parent, { password, token }, { models }, info) {
      const dbUser = await models.user.findOne({
        where: {
          resetPasswordToken: token
        }
      });

      if (dbUser) {
        await dbUser.update({
          password: await hashedPassword(password),
          resetPasswordToken: null
        });
        return {
          message: 'Password updated successfully.'
        };
      }

      throw new Error('Password reset token is invalid.');
    },
    async updateUser(parent, { firstName, lastName, email, password }, { user, models }, info) {
      await user.update({
        firstName,
        lastName,
        email
      });
      if (password) {
        await user.update({
          password: await hashedPassword(password)
        });
      }
      return models.user.findOne({ where: { id: user.id } });
    },
    async deleteUser(parent, { id }, { models }, info) {
      models.user.destroy({
        where: {
          id
        }
      });
    },
    async addCreditCard(parent, args, context, info) {
      const { stripeCustomerId: customerId } = context.user;
      const { token } = args;

      await createCard({
        token,
        customerId
      });

      return {
        message: 'Successfully updated billing information.'
      };
    },
    async subscribePlan(parent, args, context, info) {
      const { planId } = args;
      const { stripeCustomerId: customerId } = context.user;

      await createSubscription({
        planId,
        customerId
      });

      return {
        message: 'Successfully subscribed to plan.'
      };
    }
  }
};

const hashedPassword = password => bcrypt.hash(password, 10);
const getJwt = ({ id, email }) => jsonwebtoken.sign({ id, email }, process.env.JWT_SECRET);
const getUserWithTeam = id =>
  dbModels.user.findOne({
    where: { id },
    include: [{ model: dbModels.team }]
  });
