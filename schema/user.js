import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User @requireAuth
    paymentHistory: [Invoice] @requireAuth
  }

  extend type Mutation {
    signup(firstName: String!, lastName: String!, email: String!, password: String!): AuthPayload!
      @analytics(type: "identify")
    login(email: String!, password: String!): AuthPayload! @analytics(type: "identify")
    forgotPassword(email: String!): Result
    resetPassword(password: String!, token: String!): Result
    updateUser(firstName: String, lastName: String, email: String, password: String): User!
      @requireAuth
    deleteUser(id: ID!): Int!
    addCreditCard(token: String): Result @requireAuth
    subscribePlan(planId: String!): Result @requireAuth
  }

  type AuthPayload {
    jwt: String!
    user: User!
  }

  type Result {
    message: String
  }

  type User {
    id: String
    firstName: String
    lastName: String
    fullName: String @computed(value: "$firstName $lastName")
    email: String
    createdAt: DateTime
    updatedAt: DateTime
    periodStart: DateTime
    periodEnd: DateTime
    team: Team
  }

  type Invoice {
    amountDue: Int
    amountPaid: Int
    invoicePdf: String
    status: String
    date: DateTime
    periodStart: DateTime
    periodEnd: DateTime
  }
`;
