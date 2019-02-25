import { defaultFieldResolver } from 'graphql';
import { SchemaDirectiveVisitor } from 'apollo-server';
import _ from 'lodash';

export default class ComputedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { name, resolve = defaultFieldResolver } = field;

    field.resolve = async (...args) => {
      const result = await resolve.apply(this, args);
      let { value } = this.args;
      const root = args[0];
      const updatedRoot = {
        ...root,
        [name]: result
      };

      const { dataValues } = updatedRoot;
      _.each(dataValues, (val, key) => {
        value = value.replace(`$${key}`, val);
      });

      return value;
    };
  }
}
