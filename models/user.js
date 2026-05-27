'use strict';

const bcryptjs = require('bcryptjs');

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate() {}
  }

  User.init(
    {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'tbl_user',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
      hooks: {
        beforeCreate: async (client) => {
          if (client.password) {
            client.password = await bcryptjs.hash(client.password, 10);
          }
        },
        beforeUpdate: async (client) => {
          if (client.changed('password')) {
            client.password = await bcryptjs.hash(client.password, 10);
          }
        }
      }
    }
  );

  return User;
};
