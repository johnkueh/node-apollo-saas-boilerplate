import 'dotenv/config';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import jwt from 'express-jwt';

import schema from './schema';
import resolvers from './resolvers';
import RequireAuthDirective from './directives/requireAuthDirective';
import ComputedDirective from './directives/computedDirective';
import models, { sequelize } from './db/models';

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

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});
