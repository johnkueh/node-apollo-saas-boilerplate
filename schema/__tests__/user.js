import { mockServer } from 'graphql-tools';
import schema from '../index';

const mocks = {
  Boolean: () => false,
  ID: () => '1',
  Int: () => 1,
  Float: () => 12.34,
  String: () => 'String',
  DateTime: () => new Date(2018, 8, 8)
};

const server = mockServer(schema, mocks, false);

describe('User schema', () => {
  it('has valid type definitions', () => {
    expect(() => server.query(`{ __schema { types { name } } }`)).not.toThrow();
  });

  it(`query { me } should return expected value`, () => {
    const payload = `
      query {
        me {
          id
          firstName
          lastName
          fullName
          email
          createdAt
          updatedAt
          periodStart
          periodEnd
          team {
            id
            name
          }
        }
      }
    `;

    const variables = {};

    expect(server.query(payload, variables)).resolves.toMatchSnapshot();
  });

  it(`query { paymentHistory } should return expected value`, () => {
    const payload = `
      query {
        paymentHistory {
          amountDue
          amountPaid
          invoicePdf
          status
          date
          periodStart
          periodEnd
        }
      }
    `;

    const variables = {};

    expect(server.query(payload, variables)).resolves.toMatchSnapshot();
  });

  it(`mutation { signUp } should return expected value`, () => {
    const payload = `
      mutation Signup($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
        signup(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
          jwt
          user {
            id
            firstName
            lastName
            email
          }
        }
      }
    `;

    const variables = {
      firstName: 'John',
      lastName: 'Kueh',
      email: 'john@beaconmaker.com',
      password: 'test123'
    };

    expect(server.query(payload, variables)).resolves.toMatchSnapshot();
  });

  it(`mutation { login } should return expected value`, () => {
    const payload = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          jwt
          user {
            id
            firstName
            lastName
            email
          }
        }
      }
    `;

    const variables = {
      email: 'john@beaconmaker.com',
      password: 'test123'
    };

    expect(server.query(payload, variables)).resolves.toMatchSnapshot();
  });

  it(`mutation { forgotPassword } should return expected value`, () => {
    const payload = `
      mutation ForgotPassword($email: String!) {
        forgotPassword(email: $email) {
          message
        }
      }
    `;

    const variables = {
      email: 'john@beaconmaker.com'
    };

    expect(server.query(payload, variables)).resolves.toMatchSnapshot();
  });

  it(`mutation { updateUser } should return expected value`, () => {
    const payload = `
      mutation UpdateUser($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
        updateUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
          id
          firstName
          lastName
          email
        }
      }
    `;

    const variables = {
      firstName: 'John',
      lastName: 'Kueh',
      email: 'john@beaconmaker.com',
      password: 'test123'
    };

    expect(server.query(payload, variables)).resolves.toMatchSnapshot();
  });

  it(`mutation { deleteUser } should return expected value`, () => {
    const payload = `
      mutation DeleteUser($id: ID!) {
        deleteUser(id: $id)
      }
    `;

    const variables = {
      id: 1
    };

    expect(server.query(payload, variables)).resolves.toMatchSnapshot();
  });

  it(`mutation { addCreditCard } should return expected value`, () => {
    const payload = `
      mutation AddCreditCard($token: String!) {
        addCreditCard(token: $token) {
          message
        }
      }
    `;

    const variables = {
      token: 'tok_1234'
    };

    expect(server.query(payload, variables)).resolves.toMatchSnapshot();
  });

  it(`mutation { subscribePlan } should return expected value`, () => {
    const payload = `
      mutation SubscribePlan($planId: String!) {
        subscribePlan(planId: $planId) {
          message
        }
      }
    `;

    const variables = {
      planId: 'plan_123'
    };

    expect(server.query(payload, variables)).resolves.toMatchSnapshot();
  });
});
