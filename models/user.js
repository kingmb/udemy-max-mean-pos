'use strict';
module.exports = function(sequelize, Sequelize) {
  var User = sequelize.define('User', {
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      version: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1
      }
  }, 
  {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Message, { foreignKey: 'user'})
      }
    }
    ,
    hooks: {
        beforeUpdate: function (user, options) {
            user.version = user.version + 1;
        }
    }
  });
  return User;
};