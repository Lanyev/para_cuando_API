const UsersService = require('../services/users.service')
const {CustomError} = require( '../utils/helpers' )
const { getPagination, getPagingData } = require('../utils/helpers')
const { uploadFile, deleteFile } = require( '../libs/awsS3' )
const {unlinkSync:unlinkFile} = require( 'fs' )

const usersService = new UsersService()

const getUsers = async (request, response, next) => {
  try {
    const admin = request.admin

    if( !admin ) return next( new CustomError('You don\'t have permissions', 403, 'Forbidden'))


    let query = request.query
    let { page, size } = query
    const { limit, offset } = getPagination(page, size, '10')
    query.limit = limit
    query.offset = offset

    let users = await usersService.findAndCount(query)
    const results = getPagingData(users, page, limit)
    return response.json({ results: results })
  } catch (error) {
    next(error)
  }
}

const getUserById = async (request, response, next) => {
  try {
    let { id } = request.params
    const admin = request.admin
    const sameUser = request.isSameUser(id)
    let scope = 'public'
    
    if (sameUser || admin ) 
      scope = 'admin'

    let user = await usersService.getUser(id, scope)
    return response.json({ results: user })
   
  } catch (error) {
    next(error)
  }
}

const getMyUser = async (request, response, next) => {
  try {
    let { id } = request.user.id
    let user = await usersService.getUser(id)
    return response.json({ results: user })
  } catch (error) {
    next(error)
  }
}

const patchUser = async (request, response, next) => {
  try {
    let { id } = request.user
    
    if (id !== request.params.id) 
      return response.status(403).json({ message: 'Forbidden' })
      
    let { body } = request
    let user = await usersService.updateUser(id, body)
    return response.json({ message: "success update" })
  } catch (error) {
    next(error)
  }
}

const uploadImageUser = async (request, response, next) => {

  const {id} = request.params;
  const file = request.file;
  const admin = request.admin
  const sameUser = request.isSameUser(id)
  console.log(file)
  try {
    if( !admin && !sameUser ) return next( new CustomError('You don\'t have permissions', 403, 'Forbidden'))

    if (!file) return next( new CustomError('Image not received', 400, 'Bad Request') )

    let user = await usersService.getUser(id)

    if(!user) return

    let fileKey = `public/users/images/image-${id}`;

    if (file.mimetype == 'image/png') {
      fileKey = `public/users/images/image-${id}.png`;
    }

    if (file.mimetype == 'image/jpg') {
      fileKey = `public/users/images/image-${id}.jpg`;
    }

    if (file.mimetype == 'image/jpeg') {
      fileKey = `public/users/images/image-${id}.jpeg`;
    }

    await uploadFile(file, fileKey);
    let bucketURL = `${process.env.AWS_DOMAIN}${fileKey}`;
    let newImagePublication = await usersService.createUserImage(
      id,
      bucketURL
    );

    // await unlinkFile(file.path);

    return response
      .status(200)
      .json({ results: bucketURL });

  } catch (error) {
    // await unlinkFile(file.path);
    return next(error);
  }
};

const removeUserImage = async (request, response, next) => {
const {id} = request.params 
const admin = request.admin
const sameUser = request.isSameUser(id)

try {
  if( !admin && !sameUser ) return next( new CustomError('You don\'t have permissions', 403, 'Unauthorized'))

  let {image_url} = await usersService.getUser(id)
  let awsDomain = process.env.AWS_DOMAIN
  const imageKey = image_url.replace(awsDomain, '')
  await deleteFile(imageKey)
  let publicationImage = await usersService.removeUserImage(id)

  return response.status(200).json({ message: 'Removed', image: publicationImage.image_url })
} catch (error) {
  next(error)
}
}

module.exports = {
  getUsers,
  getUserById,
  getMyUser,
  patchUser,
  uploadImageUser,
  removeUserImage
}
