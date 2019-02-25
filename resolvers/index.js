import { GraphQLDateTime } from 'graphql-iso-date';

import userResolvers from './user';
import teamResolvers from './team';

const customScalarResolver = {
  DateTime: GraphQLDateTime
};

export default [customScalarResolver, userResolvers, teamResolvers];
