'use strict';
module.exports = function(sequelize, Sequelize) {
  var Message = sequelize.define('Message', {
      content: {
        type: Sequelize.STRING,
        allowNull: false,
      },
       //foreign key usage
      user: {
          type: Sequelize.INTEGER,
          allowNull: false,
          onUpdate: 'cascade',
          onDelete: 'cascade'
      },
      version: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1
      }
  }, {
    classMethods: {
      associate: function(models) {
         Message.belongsTo(models.User, { foreignKey: 'user'})
      }
    },
    hooks: {
        beforeUpdate: function (message, options) {
            message.version = message.version + 1;
        }
    }
  });
  return Message;
};