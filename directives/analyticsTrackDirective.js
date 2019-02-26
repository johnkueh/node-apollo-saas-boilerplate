import { defaultFieldResolver } from 'graphql';
import { SchemaDirectiveVisitor } from 'apollo-server';
import _ from 'lodash';
import { analytics } from '../services/segment';

export default class AnalyticsTrackDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { name, resolve = defaultFieldResolver } = field;

    field.resolve = async (...args) => {
      const result = await resolve.apply(this, args);
      const [root, otherArgs, context, info] = args;
      const { event } = this.args;
      const { user } = context;

      if (process.env.SEGMENT_WRITE_KEY) {
        analytics.track({
          event,
          userId: user.id,
          properties: otherArgs
        });
      }

      return result;
    };
  }
}
