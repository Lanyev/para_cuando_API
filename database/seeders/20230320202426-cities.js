'use strict';
const { Op } = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert(
        'cities',
        [
          {
            id: '1',
            state_id: '1',
            name: 'Aguascalientes',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '2',
            state_id: '1',
            name: 'Asientos',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '3',
            state_id: '1',
            name: 'Calvillo',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '4',
            state_id: '2',
            name: 'Guadalajara',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '5',
            state_id: '2',
            name: 'Zapopan',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '6',
            state_id: '2',
            name: 'Tlaquepaque',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '7',
            state_id: '3',
            name: 'Tijuana',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '8',
            state_id: '3',
            name: 'Mexicali',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '9',
            state_id: '3',
            name: 'Ensenada',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '10',
            state_id: '4',
            name: 'Usaquén',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '11',
            state_id: '4',
            name: 'Chapinero',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '12',
            state_id: '4',
            name: 'Santa Fe',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '13',
            state_id: '5',
            name: 'Lima',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '14',
            state_id: '5',
            name: 'Miraflores',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '15',
            state_id: '5',
            name: 'San Isidro',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '16',
            state_id: '6',
            name: 'Córdoba',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '17',
            state_id: '6',
            name: 'Río Cuarto',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '18',
            state_id: '6',
            name: 'Villa María',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '19',
            state_id: '7',
            name: 'Barranca',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '20',
            state_id: '7',
            name: 'Cajatambo',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '21',
            state_id: '7',
            name: 'Canta',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '22',
            state_id: '8',
            name: 'Acomayo',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '23',
            state_id: '8',
            name: 'Paruro',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '24',
            state_id: '8',
            name: 'Urubamba',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '25',
            state_id: '9',
            name: 'Camaná',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '26',
            state_id: '9',
            name: 'Caylloma',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '27',
            state_id: '9',
            name: 'Islay',
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('cities', {
        name: {
          [Op.in]: [
            'Aguascalientes',
            'Asientos',
            'Calvillo',
            'Guadalajara',
            'Zapopan',
            'Tlaquepaque',
            'Tijuana',
            'Mexicali',
            'Ensenada',
            'Usaquén',
            'Chapinero',
            'Santa Fe',
            'Lima',
            'Miraflores',
            'San Isidro',
            'Córdoba',
            'Río Cuarto',
            'Villa María',
            'Barranca',
            'Cajatambo',
            'Canta',
            'Acomayo',
            'Paruro',
            'Urubamba',
            'Camaná',
            'Caylloma',
            'Islay'
          ],
        },
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
