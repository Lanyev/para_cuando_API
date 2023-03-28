const sameUser = async (request, _response, next)  => {
    try {
        let userId = request.user.id
        let isSameUser = (paramsId) => paramsId == userId
        request.isSameUser = isSameUser
        
        return next()
    } catch (error) {
        next(error)
    }
}

module.exports = sameUser