import Team from '../team';
import '../../../lib/sequelize-matchers';

describe('Team', () => {
  it('have many users', () => {
    expect(Team).toHaveMany('user');
  });
});
