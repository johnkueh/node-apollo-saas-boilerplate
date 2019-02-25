import 'dotenv/config';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import jwt from 'express-jwt';
import bodyParser from 'body-parser';
import moment from 'moment';
import schema from './schema';
import resolvers from './resolvers';
import RequireAuthDirective from './directives/requireAuthDirective';
import ComputedDirective from './directives/computedDirective';
import models, { sequelize } from './db/models';
import { handleWebhook } from './services/stripe';

const app = express();

app.use(
  jwt({ secret: process.env.JWT_SECRET, credentialsRequired: false }),
  // https://github.com/auth0/express-jwt/issues/194
  (err, req, res, next) => {
    if (err.code === 'invalid_token') return next();
    return next(err);
  }
);

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  schemaDirectives: {
    requireAuth: RequireAuthDirective,
    computed: ComputedDirective
  },
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message
    };
  },
  context: async ({ req }) => {
    const dbUser = req.user ? await models.user.findOne({ where: { id: req.user.id } }) : null;
    return {
      models,
      user: dbUser
    };
  }
});

server.applyMiddleware({ app });

app.use(bodyParser.raw({ type: '*/*' }));
app.post('/webhooks/stripe', (req, res, next) => {
  handleWebhook({
    req,
    res,
    handleSubscriptionUpdated: async ({ customerId, periodStart, periodEnd }) => {
      const user = await models.user.findOne({ where: { stripeCustomerId: customerId } });
      user.update({
        periodStart: moment.unix(periodStart).toDate(),
        periodEnd: moment.unix(periodEnd).toDate()
      });
    }
  });
  next();
});

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});
