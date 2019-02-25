import _ from 'lodash';

export const toCamelCase = array => {
  const result = [];
  _.map(array, rawObj => {
    const obj = {};
    _.map(rawObj, (val, key) => {
      obj[_.camelCase(key)] = val;
    });
    result.push(obj);
  });
  return result;
};

export const toSnakeCase = () => {};
