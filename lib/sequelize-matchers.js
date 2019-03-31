import _ from 'lodash';

const sequelize = {
  define: jest.fn((name, attributes) => ({
    name,
    belongsTo: jest.fn(),
    hasMany: jest.fn(),
    prototype: {}
  }))
};
const DataTypes = {
  STRING: '',
  DATE: ''
};

const checkRelationship = ({ model, type, argument }) => {
  const modelName = _.capitalize(model.name);

  if (model.associate == null) {
    return {
      pass: false,
      message: () => `Expected ${modelName} to have an .associate method defined`
    };
  }

  model.associate({ [argument]: 'test-associate' });

  try {
    expect(model[type]).toHaveBeenCalledWith('test-associate');
  } catch (e) {
    return {
      pass: false,
      message: () => `Expected ${modelName} to have a .${type} association with models.${argument}`
    };
  }

  return { pass: true };
};

expect.extend({
  toBelongTo(received, argument) {
    const model = received(sequelize, DataTypes);

    return checkRelationship({
      model,
      argument,
      type: 'belongsTo'
    });
  },
  toHaveMany(received, argument) {
    const model = received(sequelize, DataTypes);

    return checkRelationship({
      model,
      argument,
      type: 'hasMany'
    });
  }
});
