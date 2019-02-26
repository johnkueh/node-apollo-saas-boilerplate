import { gql } from 'apollo-server-express';

export default gql`
  extend type Mutation {
    createTeam(name: String!): Team!
      @requireAuth
      @analytics(type: "track", event: "Create Team")
      @analytics_group(type: "group")
    updateTeam(name: String!): Team! @requireAuth @analytics(type: "track", event: "Update Team")
  }

  type Team {
    id: String
    name: String
  }
`;
