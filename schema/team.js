import { gql } from 'apollo-server-express';

export default gql`
  extend type Mutation {
    createTeam(name: String!): Team! @requireAuth @analyticsTrack(event: "Create Team")
    updateTeam(name: String!): Team! @requireAuth @analyticsTrack(event: "Update Team")
  }

  type Team {
    id: String
    name: String
  }
`;
