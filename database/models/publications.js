'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publications extends Model {
    static associate(models) {
      Publications.belongsTo(models.Users, {
        as: 'user',
        foreignKey: 'user_id',
      });
      Publications.belongsTo(models.PublicationsTypes, {
        as: 'publication_type',
        foreignKey: 'publication_type_id',
      });
      Publications.belongsTo(models.Cities, {
        as: 'city',
        foreignKey: 'city_id',
      });
    }
  }
  Publications.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
      },
      publication_type_id: {
        type: DataTypes.INTEGER,
      },
      city_id: {
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      content: {
        type: DataTypes.TEXT,
      },
      reference_link: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Publications',
      tableName: 'publications',
      underscored: true,
      timestamps: true,
      scopes: {
        view_public: {
          attributes: [
            'id',
            'user_id',
            'publication_type_id',
            'city_id',
            'title',
            'description',
            'reference_link',
          ],
        },
        view_same_user: {
          attributes: [
            'id',
            'user_id',
            'publication_type_id',
            'city_id',
            'title',
            'description',
            'reference_link',
          ],
        },
        view_me: {
          attributes: [
            'id',
            'user_id',
            'publication_type_id',
            'city_id',
            'title',
            'description',
            'reference_link',
          ],
        },
      },
    }
  );
  return Publications;
};
