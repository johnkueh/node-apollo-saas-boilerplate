'use strict';

module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define(
    'team',
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          notNull: true,
          notEmpty: true
        }
      }
    },
    {}
  );
  Team.associate = function(models) {
    Team.hasMany(models.user);
  };
  return Team;
};
