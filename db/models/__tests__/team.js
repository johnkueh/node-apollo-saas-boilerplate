import Team from '../team';
import { itShouldValidate, itShouldAssociate } from '../../../lib/sequelize-helpers';

describe('Team', () => {
  itShouldAssociate(Team, 'user').with('hasMany');
  itShouldValidate(Team, 'name').with({ notNull: true, notEmpty: true });
});
