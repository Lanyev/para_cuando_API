'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tags extends Model {
    static associate(models) {
      // Tags.hasMany( models.PublicationsTags, { as: 'publications_tags', foreignKey: 'tags_id '} )
      Tags.belongsToMany( models.Users, { as: 'interests', through: 'users_tags', foreignKey: 'tag_id'} )
    }
  }
  Tags.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull:false
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