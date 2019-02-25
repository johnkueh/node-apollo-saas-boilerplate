'use strict';
const uuidv4 = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    stripeCustomerId: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    periodStart: DataTypes.DATE,
    periodEnd: DataTypes.DATE
  });
  User.associate = function(models) {
    User.belongsTo(models.team);
  };
  User.prototype.regeneratePasswordToken = async function(models) {
    const token = uuidv4();

    await this.update({
      resetPasswordToken: token
    });

    return token;
  };
  return User;
};
