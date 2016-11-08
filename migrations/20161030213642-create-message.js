'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
      },
       //foreign key usage
      user: {
          type: Sequelize.INTEGER,
          references: {
              model: 'Users',
              key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      version: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1
      }
    }, 
    {
      charset: 'UTF8',       
    }
    );
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Messages');
  }
};