const models = require('../database/models')
const { Op } = require('sequelize')
const  {CustomError}  = require('../utils/helpers')

class ProfilesService {

  constructor() {
  }
  
  //Return Instance if we do not converted to json (or raw:true)
  async getProfileOr404(id) {
    let profile = await models.Profiles.findByPk(id, { raw: true })
    if (!profile) throw new CustomError('Not found Profile', 404, 'Not Found')
    return profile
  }

  //Return not an Instance raw:true | we also can converted to Json instead
  async getProfile(id) {
    let profile = await models.Profiles.findByPk(id)
    if (!profile) throw new CustomError('Not found Profile', 404, 'Not Found')
    return profile
  }

  async findProfileByUserID(user_id) {
    let profile = await models.Profiles.findOne({where: {user_id}}, { raw: true })
    if (!profile) throw new CustomError('Not found profile', 404, 'Not Found')
    return profile
  }

  async isAdmin(user_id){
    let profile = await models.Profiles.scope('no_timestamps').findOne({
      where:{
        user_id,
        role_id:2
      }
    })
    // const algo = await models.Users.describe()
    // console.log( Object.entries(algo).map( item => item[0]) )
    
    // const rol = await models.Roles.scope('no_timestamps').findOne({
    //   where:{
    //     id: profile.dataValues.role_id
    //   }
    // })
    // const {role_id, ...restProfile} = profile.dataValues
    // profile = {...restProfile, rol:rol.dataValues}
    // console.log(profile)
    return profile ? true : false
  }

}

module.exports = ProfilesService