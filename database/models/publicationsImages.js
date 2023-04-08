'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PublicationsImages extends Model {
    static associate(models) {
      // Cities.belongsTo( models.States, { as: 'states', foreignKey: 'state_id'} )
      // Cities.hasMany( models.Publications, { as: 'publications', foreignKey: 'city_id'} )
    }
  }
  PublicationsImages.init({
    publication_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    image_url: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    order: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PublicationsImages',
    tableName: 'publications_images',
    underscored: true,
    timestamps: true,
    scopes: { }
  });
  return PublicationsImages;
};