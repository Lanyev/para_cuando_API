// const CitiesService = require('../services/countries.service')
const CitiesService = require('../services/cities.services')
const { getPagination, getPagingData } = require( '../utils/helpers' )

const citiesService = new CitiesService()

const getAllCities = async ( request, response, next ) => {
    try {
        let query = request.query
        let { page , size  } = query
        const { limit, offset } = getPagination(page, size, '10')
        query.limit = limit
        query.offset = offset 

        const cities = await citiesService.findAndCount(query)
        const results = getPagingData(cities, page, limit)
        return response.json({ results: results })
        
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllCities
}