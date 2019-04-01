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

describe('Team schema', () => {
  it('has valid type definitions', () => {
    expect(() => server.query(`{ __schema { types { name } } }`)).not.toThrow();
  });

  it(`mutation { createTeam } should return expected value`, () => {
    const payload = `
      mutation CreateTeam($name: String!) {
        createTeam(name: $name) {
          id
          name
        }
      }
    `;

    const variables = {
      name: 'Awesome team'
    };

    expect(server.query(payload, variables)).resolves.toMatchSnapshot();
  });

  it(`mutation { updateTeam } should return expected value`, () => {
    const payload = `
      mutation UpdateTeam($name: String!) {
        updateTeam(name: $name) {
          id
          name
        }
      }
    `;

    const variables = {
      name: 'Awesome team 2'
    };

    expect(server.query(payload, variables)).resolves.toMatchSnapshot();
  });
});
