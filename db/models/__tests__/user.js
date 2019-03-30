import User from '../user';
import '../../../lib/sequelize-matchers';

describe('User', () => {
  it('belongs to team', () => {
    expect(User).toBelongTo('team');
  });
});
