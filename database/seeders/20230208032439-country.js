//Seeder creado

//noten que es igual a una migración!

'use strict'
const { Op } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, /*Sequelize*/) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.bulkInsert('countries', [
        {
          id: '1',
          name: 'México',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '2',
          name: 'Colombia',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '3',
          name: 'Peru',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '4',
          name: 'Argentina',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '5',
          name: 'Uruguay',
          created_at: new Date(),
          updated_at: new Date()
        }
      ], { transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, /*Sequelize*/) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.bulkDelete('countries', {
        name: {
          [Op.or]: ['México']
        },
        name: {
          [Op.or]: ['Colombia']
        },
        name: {
          [Op.or]: ['Peru']
        },
        name: {
          [Op.or]: ['Argentina']
        },
        name: {
          [Op.or]: ['Uruguay']
        }
      }, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}