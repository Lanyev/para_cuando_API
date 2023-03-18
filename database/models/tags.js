'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tags extends Model {
    static associate(models) {
      // Tags.hasMany( models.PublicationsTags, { as: 'publications_tags', foreignKey: 'tags_id '} )
      // Tags.hasMany( models.UsersTags, { as: 'users_tags', foreignKey: 'tags_id '} )
    }
  }
  Tags.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    image_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tags',
    tableName: 'tags',
    underscored: true,
    timestamps: true,
    scopes: { }
  });
  return Tags;
};