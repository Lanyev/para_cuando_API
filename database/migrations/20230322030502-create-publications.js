'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'publications',
        {
          id: {
            allowNull: false,

            primaryKey: true,
            type: Sequelize.UUID,
          },
          user_id: {
            type: Sequelize.UUID,
          },
          publication_type_id: {
            type: Sequelize.INTEGER,
          },
          city_id: {
            type: Sequelize.INTEGER,
          },
          title: {
            type: Sequelize.STRING,
          },
          description: {
            type: Sequelize.STRING,
          },
          content: {
            type: Sequelize.TEXT,
          },
          reference_link: {
            type: Sequelize.TEXT,
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('publications', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
