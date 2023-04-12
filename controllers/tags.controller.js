const TagsService = require('../services/tags.services')
const { getPagination, getPagingData } = require('../utils/helpers')
const { uploadFile, deleteFile } = require( '../libs/awsS3' )

const tagsService = new TagsService();

const getTags = async (request, response, next) => {
  try {
    let query = request.query
    let { page, size } = query
    const { limit, offset } = getPagination(page, size, '10')
    query.limit = limit
    query.offset = offset

    let tags = await tagsService.findAndCount(query)
    const results = getPagingData(tags, page, limit)
    return response.json({ results: results })
  } catch (error) {
    next(error)
  }
}

const postTag = async ( request, response, next ) =>{
  try {
    const admin = request.admin

    if ( !admin ) 
      return response.status(403).json({ message: 'Unauthorized' })

    let { body } = request;
    let tag = await tagsService.createTags( body )
    return response.status(201).json({ results: tag })
  } catch (error) {
    next(error)
  }
}

const getTagById = async (request, response, next) => {
  try {
    let { id } = request.params
    let tag = await tagsService.getTag(id);
    return response.json({ results: tag });
  } catch (error) {
    next(error);
  }
};

const putTag = async (request, response, next) => {
  try {
    const admin = request.admin
    
    if ( !admin ) return response.status(403).json({ message: 'Forbidden' })

    let { id } = request.params;
    let { body } = request;
    let tag = await tagsService.updateTag(id, body);
    return response.json({ results: tag });
  } catch (error) {
    next(error);
  }
};

const deleteTag = async (request, response, next) => {
  try {
    const admin = request.admin

    if ( !admin ) return response.status(403).json({ message: 'Forbidden' })

    let { id } = request.params;
    let tag = await tagsService.removeTag( id );
    return response.json({ results:tag, message: 'removed' });
  } catch (error) {
    next(error);
  }
};


const uploadImageTag = async (request, response, next) => {

  const {id} = request.params;
  const file = request.file;
  const admin = request.admin
  console.log(file)
  try {
    if (!admin) throw new CustomError('You don\'t have permissions', 401, 'Unauthorized')
    
    if (!file) throw new CustomError('No image received', 400, 'Bad Request');

    let tag = await tagsService.getTag(id)

    if(!tag) return

    let fileKey = `public/tags/images/image-${id}`;

    if (file.mimetype == 'image/png') {
      fileKey = `public/tags/images/image-${id}.png`;
    }

    if (file.mimetype == 'image/jpg') {
      fileKey = `public/tags/images/image-${id}.jpg`;
    }

    if (file.mimetype == 'image/jpeg') {
      fileKey = `public/tags/images/image-${id}.jpeg`;
    }

    await uploadFile(file, fileKey);
    let bucketURL = `${process.env.AWS_DOMAIN}${fileKey}`;
    let newImagePublication = await tagsService.createUserImage(
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

const removeUserTag = async (request, response, next) => {
const {id} = request.params
const admin = request.admin
try {
  if (!admin) throw new CustomError('You don\'t have permissions', 401, 'Unauthorized')

  let {image_url} = await tagsService.getUser(id)
  let awsDomain = process.env.AWS_DOMAIN
  const imageKey = image_url.replace(awsDomain, '')
  await deleteFile(imageKey)
  let publicationImage = await tagsService.removeUserImage(id)

  return response.status(200).json({ message: 'Removed', image: publicationImage })
} catch (error) {
  next(error)
}
}

module.exports = {
  getTags,
  postTag,
  getTagById,
  putTag,
  deleteTag,
  uploadImageTag,
  removeUserTag
};
