import { itShouldValidate, itShouldAssociate } from 'lib/sequelize-matchers';
import Team from '../team';

describe('Team', () => {
  itShouldAssociate(Team, 'user').with('hasMany');
  itShouldValidate(Team, 'name').with({ notNull: true, notEmpty: true });
});
