import _ from 'lodash';

export const sequelize = {
  define: jest.fn((name, attributes) => ({
    name,
    attributes,
    belongsTo: jest.fn(),
    hasMany: jest.fn(),
    prototype: {}
  }))
};
export const DataTypes = {
  STRING: '',
  DATE: ''
};

export const checkRelationship = ({ model, type, argument }) => {
  const modelName = _.capitalize(model.name);

  if (_.isUndefined(model.associate)) {
    return {
      pass: false,
      message: () => `Expected ${modelName} to have an .associate method`
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
  toHaveRelationship(received, argument, type) {
    const model = received(sequelize, DataTypes);

    return checkRelationship({
      model,
      argument,
      type
    });
  },
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
  },
  toBeValidatedWith(received, attribute, validations) {
    const model = received(sequelize, DataTypes);
    const modelName = _.capitalize(model.name);

    const message = () => {
      const options = {
        comment: 'Object.is equality',
        isNot: this.isNot,
        promise: this.promise
      };

      return `${this.utils.matcherHint(
        'toBeValidatedWith',
        `${modelName}.${attribute}`,
        this.utils.stringify(validations),
        options
      )}\n\nExpected: ${this.utils.printExpected(
        validations
      )}\nReceived: ${this.utils.printReceived(model.attributes[attribute].validate)}`;
    };

    if (_.isUndefined(model.attributes[attribute].validate)) {
      return {
        pass: false,
        message
      };
    }

    const matches = _.keys(validations).map(key => {
      return _.isEqual(model.attributes[attribute].validate[key], validations[key]);
    });

    if (_.includes(matches, false)) {
      return {
        pass: false,
        message
      };
    }

    return {
      pass: true
    };
  }
});
