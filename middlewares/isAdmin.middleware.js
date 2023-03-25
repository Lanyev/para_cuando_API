const ProfilesService = require( '../services/profiles.service' )

const profilesService = new ProfilesService()

const isAdmin = async (request, _response, next)  => {
    try {
        let { id } = request.user
        let isAdmin = await profilesService.isAdmin(id)

        request.admin = isAdmin
        
        return next()
    } catch (error) {
        next(error)
    }
}

module.exports = isAdmin