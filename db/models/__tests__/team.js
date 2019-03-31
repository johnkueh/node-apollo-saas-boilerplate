import { itShouldValidate, itShouldAssociate } from 'lib/sequelize-helpers';
import Team from '../team';

describe('Team', () => {
  itShouldAssociate(Team, 'user').with('hasMany');
  itShouldValidate(Team, 'name').with({ notNull: true, notEmpty: true });
});
