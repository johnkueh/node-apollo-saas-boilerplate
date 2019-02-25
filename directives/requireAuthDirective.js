import { defaultFieldResolver } from 'graphql';
import { SchemaDirectiveVisitor, AuthenticationError } from 'apollo-server';
import dbModels from '../db/models';

export default class RequireAuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async (...args) => {
      const [, , { user }] = args;

      if (user) {
        if (await dbModels.user.findOne({ where: { id: user.id } })) {
          const result = await resolve.apply(this, args);
          return result;
        }
      }

      throw new AuthenticationError('You must be authenticated to perform this action');
    };
  }
}
