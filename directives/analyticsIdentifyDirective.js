import { defaultFieldResolver } from 'graphql';
import { SchemaDirectiveVisitor } from 'apollo-server';
import _ from 'lodash';
import { identify } from '../services/segment';

export default class ComputedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { name, resolve = defaultFieldResolver } = field;

    field.resolve = async (...args) => {
      const result = await resolve.apply(this, args);
      const { user } = result;

      if (user && process.env.SEGMENT_WRITE_KEY) {
        identify(user);
      }

      return result;
    };
  }
}
