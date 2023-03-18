const CountriesService = require('../services/countries.service')
const { getPagination, getPagingData } = require( '../utils/helpers' )

const countriesService = new CountriesService()

const getAllCountries = async ( request, response, next ) => {
    try {
        let query = request.query
        let { page , size  } = query
        const { limit, offset } = getPagination(page, size, '10')
        query.limit = limit
        query.offset = offset 

        const countries = await countriesService.findAndCount(query)
        const results = getPagingData(countries, page, limit)
        return response.json({ results: results })
        
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllCountries
}