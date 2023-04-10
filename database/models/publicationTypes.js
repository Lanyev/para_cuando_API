'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PublicationsTypes extends Model {
    static associate(models) {
      PublicationsTypes.hasMany( models.Publications, { as: 'publication_type', foreignKey: 'publication_type_id'} )
    }
  }
  PublicationsTypes.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PublicationTypes',
    tableName: 'publication_types',
    underscored: true,
    timestamps: true,
    scopes: { }
  });
  return PublicationsTypes;
};