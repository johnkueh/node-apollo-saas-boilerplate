import { defaultFieldResolver } from 'graphql';
import { SchemaDirectiveVisitor } from 'apollo-server';
import _ from 'lodash';
import { identify, analytics } from '../services/segment';

export default class AnalyticsDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { name, resolve = defaultFieldResolver } = field;
    const { type, event } = this.args;

    field.resolve = async (...args) => {
      const result = await resolve.apply(this, args);
      const [root, otherArgs, context, info] = args;
      const user = result.user || result;

      if (process.env.SEGMENT_WRITE_KEY) {
        switch (type) {
          case 'identify':
            if (user.id) identify(user);
            break;
          case 'group':
            analytics.group({
              userId: user.id,
              groupId: result.id,
              traits: otherArgs
            });
            break;
          case 'track':
            analytics.track({
              event,
              userId: user.id,
              properties: otherArgs
            });
            break;
          default:
            break;
        }
      }

      return result;
    };
  }
}
