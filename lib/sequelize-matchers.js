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

expect.extend({
  toBelongTo(received, argument) {
    const model = received(sequelize, DataTypes);
    const modelName = _.capitalize(model.name);

    if (model.associate == null) {
      return {
        pass: false,
        message: () => `Expected ${modelName} to have an .associate method defined`
      };
    }

    model.associate({ [argument]: 'test-associate' });

    try {
      expect(model.belongsTo).toHaveBeenCalledWith('test-associate');
    } catch (e) {
      return {
        pass: false,
        message: () =>
          `Expected ${modelName} to have a .belongsTo association with models.${argument}`
      };
    }

    return { pass: true };
  },
  toHaveMany(received, argument) {
    const model = received(sequelize, DataTypes);
    const modelName = _.capitalize(model.name);

    if (model.associate == null) {
      return {
        pass: false,
        message: () => `Expected ${modelName} to have an .associate method defined`
      };
    }

    model.associate({ [argument]: 'test-associate' });

    try {
      expect(model.hasMany).toHaveBeenCalledWith('test-associate');
    } catch (e) {
      return {
        pass: false,
        message: () =>
          `Expected ${modelName} to have a .hasMany association with models.${argument}`
      };
    }

    return { pass: true };
  }
});
