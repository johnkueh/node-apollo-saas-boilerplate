import Analytics from 'analytics-node';
import { identify, analytics } from '../segment';

beforeEach(() => {
  process.env.SEGMENT_WRITE_KEY = 'MOCK-KEY';
});

const user = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@doe.com',
  stripeCustomerId: '1',
  createdAt: '2018-12-2014',
  updatedAt: '2018-12-2014',
  teamId: 1
};

it('analytics returns a Segment analytics object', () => {
  expect(analytics).toHaveProperty('identify');
  expect(analytics).toHaveProperty('group');
  expect(analytics).toHaveProperty('track');
});

it('identify calls segment.identify with correct arguments', () => {
  expect(Analytics).not.toHaveBeenCalled();
  identify(user);
  expect(Analytics).toHaveBeenCalled();
  expect(Analytics.mocks.identify).toHaveBeenCalledWith({
    userId: user.id,
    traits: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      stripeCustomerId: user.stripeCustomerId,
      teamId: user.teamId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  });
});
