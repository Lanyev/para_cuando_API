// const StatesService = require('../services/countries.service')
const StatesService = require('../services/states.services')
const { getPagination, getPagingData } = require( '../utils/helpers' )

const statesService = new StatesService()

const getAllStates = async ( request, response, next ) => {
    try {
        let query = request.query
        let { page , size  } = query
        const { limit, offset } = getPagination(page, size, '10')
        query.limit = limit
        query.offset = offset 

        const countries = await statesService.findAndCount(query)
        const results = getPagingData(countries, page, limit)
        return response.json({ results: results })
        
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllStates
}