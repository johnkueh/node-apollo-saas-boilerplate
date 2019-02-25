import { gql } from 'apollo-server-express';

export default gql`
  extend type Mutation {
    createTeam(name: String!): Team! @requireAuth
    updateTeam(name: String!): Team! @requireAuth
  }

  type Team {
    id: String
    name: String
  }
`;
