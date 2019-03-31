import { toCamelCase } from '../arrayUtils';

test('toCamelCase transforms keys of every object in array to camelCase', () => {
  const arr = [
    {
      id: 1,
      user_id: 1,
      first_name: 'John',
      last_name: 'Doe'
    }
  ];

  expect(toCamelCase(arr)).toEqual([
    {
      id: 1,
      userId: 1,
      firstName: 'John',
      lastName: 'Doe'
    }
  ]);
});
