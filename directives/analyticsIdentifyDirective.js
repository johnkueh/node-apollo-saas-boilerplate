import { defaultFieldResolver } from 'graphql';
import { SchemaDirectiveVisitor } from 'apollo-server';
import _ from 'lodash';
import { identify } from '../services/segment';

export default class AnalyticsIdentifyDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { name, resolve = defaultFieldResolver } = field;

    field.resolve = async (...args) => {
      const result = await resolve.apply(this, args);
      const user = result.user || result;

      if (user.id && process.env.SEGMENT_WRITE_KEY) {
        identify(user);
      }

      return result;
    };
  }
}
