import { itShouldValidate, itShouldAssociate } from 'lib/sequelize-helpers';
import User from '../user';

describe('User', () => {
  itShouldAssociate(User, 'team').with('belongsTo');
  itShouldValidate(User, 'firstName').with({ notNull: true, notEmpty: true });
  itShouldValidate(User, 'lastName').with({ notNull: true, notEmpty: true });
  itShouldValidate(User, 'email').with({ isEmail: true, notNull: true, notEmpty: true });
  itShouldValidate(User, 'password').with({ len: [6], notNull: true, notEmpty: true });
});
