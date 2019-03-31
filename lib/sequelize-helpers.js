import './sequelize-matchers';

export const itShouldValidate = (model, field) => {
  return {
    with: validations => {
      it(`should validate ${field}`, () => {
        expect(model).toBeValidatedWith(field, validations);
      });
    }
  };
};

export const itShouldAssociate = (model, association) => {
  return {
    with: type => {
      it(`${type} ${association}`, () => {
        expect(model).toHaveRelationship(association, type);
      });
    }
  };
};
