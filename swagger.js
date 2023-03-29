const swaggerUi = require('swagger-ui-express');
// Swagger definition
const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Para Cuando API - OpenAPI 3.0',
    description:
      'Esta es la API REST para la aplicación del modulo de Desarrollo Pro Backend en Academlo. \n\nEsta API fue hecha para que los estudiantes en la parte de Front, puedan interacturar de manera segura probando los features de la aplicación\n\nLos estudiantes de Backend, simplemente usarán esta API para ver que la que ellos fabriquen, funcione de la misma forma',
    version: '1.0.0',
  },
  externalDocs: {
    description: 'Documentación hecha con Swagger',
    url: 'http://swagger.io',
  },
  servers: [
    {
      url: 'http://localhost:9000/api/v1/',
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Autenticación del Usuario',
    },
    {
      name: 'Users',
      description: 'Manejo de Usuarios',
    },
    {
      name: 'Publications Types',
      description: 'Tipos de publicaciones',
    },
    {
      name: 'Publications',
      description: 'Manejo de Publicaciones',
    },
    {
      name: 'Tags',
      description: 'Manejo de Categorías',
    },
    {
      name: 'Countries',
      description: 'Información acerca de Paises',
    },
    {
      name: 'States',
      description: 'Información acerca de Estados / Provincias',
    },
    {
      name: 'Cities',
      description: 'Información acerca de Ciudades',
    },
    {
      name: 'Roles',
      description: 'Información acerca de Roles',
    },
  ],
  paths: {
    '/auth/sign-up': {
      post: {
        tags: ['Auth'],
        summary: 'Registro',
        description: 'Un usuario se registra',
        operationId: 'signUpUser',
        requestBody: {
          description: 'Registrate con tu nombre, apellido y email',
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                $ref: '#/components/schemas/UserSignUp',
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: 'Successful operation',
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        description:
          'El usuario obtiene el token para empezar a hacer peticiones',
        operationId: 'loginUser',
        requestBody: {
          required: true,
          description:
            'Email y Password para obtener el token con el que se harán las peticiones',
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                $ref: '#/components/schemas/UserLogin',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Successful operation',
          },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'User Loggued Info',
        description:
          'En base al token proporcionado como usuario autenticado en los headers, regresará información de este usuario',
        operationId: 'meInfoUser',
        responses: {
          200: {
            description: 'Successful operation',
          },
        },
        security: [
          {
            tokenJWT: [],
          },
        ],
      },
    },
    '/auth/forget-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset Password petition',
        description:
          'El usuario setea un token en la DB para que pueda cambiar su contraseña\nEl token tiene exp',
        operationId: 'forgetPassword',
        requestBody: {
          required: true,
          description: 'Solo se tiene que enviar el email',
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                $ref: '#/components/schemas/UserForgetPassword',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Successful operation',
          },
        },
      },
    },
    '/auth/change-password': {
      post: {
        tags: ['Auth'],
        summary: 'Change Password',
        description:
          'El usuario enviará su contraseña junto con el token proporcionado al email para poder re establecer su contraseña',
        operationId: 'resetPassword',
        requestBody: {
          required: true,
          description:
            'Solo se tiene que enviar la contraseña junto con el token en los queries params',
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                $ref: '#/components/schemas/UserResetPassword',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Successful operation.',
          },
        },
      },
    },
    '/users/': {
      get: {
        tags: ['Users'],
        summary: 'Filter Users',
        description: 'El administrador podrá filtrar usuarios',
        operationId: 'filterUsers',
        parameters: [
          {
            in: 'query',
            name: 'page',
            description: 'En que vista de la paginación habrá que mostrar.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'size',
            description: 'El número de registros a devolver.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'first_name',
            description: 'Se podrá filtrar por este campo del esquema.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'last_name',
            description: 'Se podrá filtrar por este campo del esquema.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'email',
            description: 'Se podrá filtrar por este campo del esquema.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'username',
            description: 'Se podrá filtrar por este campo del esquema.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'email_verified',
            description: 'Se podrá filtrar por este campo del esquema.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'country_id',
            description: 'Se podrá filtrar por este campo del esquema.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'code_phone',
            description: 'Se podrá filtrar por este campo del esquema.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'phone',
            description: 'Se podrá filtrar por este campo del esquema.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'created_at',
            description: 'Se podrá filtrar por este campo del esquema.',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Vista Paginada',
          },
        },
        security: [
          {
            tokenJWT: [],
          },
        ],
      },
    },
    '/users/{userID}/': {
      get: {
        tags: ['Users'],
        summary: 'Encuentra un usuario por ID',
        description:
          'Se verá información  pública acerca de un usuario\nSi el usuario mira su mismo perfil, se le mostrarán campos más completos Campos públicos del usuario (ver condiciones)\nfirst_name, last_name, image_url\nrelaciones interest',
        operationId: 'getUserById',
        parameters: [
          {
            name: 'userID',
            in: 'path',
            description: 'ID del usuario a retornar',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
          },
        },
        security: [
          {
            tokenJWT: [],
          },
        ],
      },
      put: {
        tags: ['Users'],
        summary: 'Alter un usuario por ID',
        description:
          'El usuario podrá editar sus campos Existen campos que no se deben de tocar a la hora de edición, por ejemplo token,email_verified, password, email, username',
        operationId: 'updateUserById',
        parameters: [
          {
            name: 'userID',
            in: 'path',
            description: 'ID del usuario a retornar',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          required: true,
          description:
            'Podrá editar los campos que no comprometan a la autenticación',
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                $ref: '#/components/schemas/UserUpdate',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'successful operation',
          },
        },
        security: [
          {
            tokenJWT: [],
          },
        ],
      },
    },
    '/users/{userID}/publications': {
      get: {
        tags: ['Users'],
        summary: 'Retorna las publicaciones en donde un usuario creó',
        description: 'Retorna las publicaciones en donde un usuario creó',
        operationId: 'getUserPublications',
        parameters: [
          {
            in: 'path',
            name: 'userID',
            description: 'ID del usuario a retornar',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
          {
            in: 'query',
            name: 'page',
            description: 'En que vista de la paginación habrá que mostrar.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'size',
            description: 'El número de registros a devolver.',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Vista Paginada',
          },
        },
        security: [
          {
            tokenJWT: [],
          },
        ],
      },
    },
    '/publications-types/': {
      get: {
        tags: ['Publications Types'],
        summary: 'Devuelve tipos de publicaciones',
        description: 'Retorna los tipos de publicaciones a elegir',
        operationId: 'getPublicationsTypes',
        parameters: [
          {
            in: 'query',
            name: 'page',
            description: 'En que vista de la paginación habrá que mostrar.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'size',
            description: 'El número de registros a devolver.',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Vista Paginada',
          },
        },
        security: [
          {
            tokenJWT: [],
          },
        ],
      },
    },
    '/publications-types/{publicationType}/': {
      get: {
        tags: ['Publications Types'],
        summary: 'Encuentra un publication type por ID',
        description: 'Devuelve información del tipo de publicación',
        operationId: 'getPublicationTypeById',
        parameters: [
          {
            name: 'publicationType',
            in: 'path',
            description: 'ID del tipo de publicación',
            required: true,
            schema: {
              type: 'string',
              format: 'integer',
            },
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
          },
        },
        security: [
          {
            tokenJWT: [],
          },
        ],
      },
      put: {
        tags: ['Publications Types'],
        summary: 'Altera los campos del publication type',
        description: 'Editará el publication type',
        operationId: 'updatePublicationTypeId',
        parameters: [
          {
            name: 'publicationType',
            in: 'path',
            description: 'ID del tipo de publicación',
            required: true,
            schema: {
              type: 'string',
              format: 'integer',
            },
          },
        ],
        requestBody: {
          required: true,
          description: 'Se editarán los campos del esquema',
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                $ref: '#/components/schemas/PublicationTypeUpdate',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'successful operation',
          },
        },
        security: [
          {
            tokenJWT: [],
          },
        ],
      },
    },
    '/publications/': {
      get: {
        tags: ['Publications'],
        summary: 'Devuelve las publicaciones',
        description: 'Retorna las publicaciones',
        operationId: 'getPublications',
        parameters: [
          {
            in: 'query',
            name: 'page',
            description: 'En que vista de la paginación habrá que mostrar.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'size',
            description: 'El número de registros a devolver.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'title',
            description: 'Se podrá filtrar por este campo del esquema.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'description',
            description: 'Se podrá filtrar por este campo del esquema.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'content',
            description: 'Se podrá filtrar por este campo del esquema.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'reference_link',
            description: 'Se podrá filtrar por este campo del esquema.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'created_at',
            description: 'Se podrá filtrar por este campo del esquema.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'publications_types_ids',
            description: 'Se podrá filtrar por este campo del esquema.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'tags',
            description:
              'Se podrá filtrar por esta relación del esquema. Los ids de los tags separados por comas',
            schema: {
              type: 'string',
              example: '1,5,6',
            },
          },
          {
            in: 'query',
            name: 'votes_count',
            description:
              'Se podrá filtrar por este calculo del esquema. | Se enviará operator = (gte,lte, lt, gt, eq) y valor que es un integer separado por una coma',
            schema: {
              type: 'string',
              example: 'operator,valor',
            },
          },
        ],
        responses: {
          200: {
            description: 'Vista Paginada',
          },
        },
      },
      post: {
        tags: ['Publications'],
        summary: 'Añade una publicación',
        description: 'Crea una publicacion',
        operationId: 'createPublications',
        requestBody: {
          required: true,
          description: 'Se creará una publicación',
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                $ref: '#/components/schemas/AddPublication',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'El objeto creado',
          },
        },
        security: [
          {
            tokenJWT: [],
          },
        ],
      },
    },
    '/publications/{publicationID}/': {
      get: {
        tags: ['Publications'],
        summary: 'Encuentra un publication por ID',
        description: 'Devuelve información de la publicación',
        operationId: 'getPublicationById',
        parameters: [
          {
            name: 'publicationID',
            in: 'path',
            description: 'ID de la publicación',
            required: true,
            schema: {
              type: 'string',
              format: 'integer',
            },
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
          },
        },
      },
      delete: {
        tags: ['Publications'],
        summary: 'Borra una publication por ID',
        description:
          'Borra la publicación, solamente si tiene imágenes asociadas, no se borrará automáticamente',
        operationId: 'deletePublicationById',
        parameters: [
          {
            name: 'publicationID',
            in: 'path',
            description: 'ID de la publicación',
            required: true,
            schema: {
              type: 'string',
              format: 'integer',
            },
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
          },
        },
        security: [
          {
            tokenJWT: [],
          },
        ],
      },
    },
    '/tags/': {
      get: {
        tags: ['Tags'],
        summary: 'Devuelve los tags',
        description: 'Retorna los tags',
        operationId: 'getTags',
        parameters: [
          {
            in: 'query',
            name: 'page',
            description: 'En que vista de la paginación habrá que mostrar.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'size',
            description: 'El número de registros a devolver.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'title',
            description: 'Se podrá filtrar por este campo del esquema.',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Vista Paginada',
          },
        },
        security: [
          {
            tokenJWT: [],
          },
        ],
      },
      post: {
        tags: ['Tags'],
        summary: 'Añade un tag',
        description: 'Crea un tag',
        operationId: 'createTags',
        requestBody: {
          required: true,
          description: 'Se creará un tag',
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                $ref: '#/components/schemas/AddTag',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'El objeto creado',
          },
        },
        security: [
          {
            tokenJWT: [],
          },
        ],
      },
    },
    '/tags/{tagID}/': {
      get: {
        tags: ['Tags'],
        summary: 'Encuentra un tag',
        description: 'Devuelve información del tag',
        operationId: 'getTagById',
        parameters: [
          {
            name: 'tagID',
            in: 'path',
            description: 'ID del tipo de tag',
            required: true,
            schema: {
              type: 'string',
              format: 'integer',
            },
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
          },
        },
        security: [
          {
            tokenJWT: [],
          },
        ],
      },
      delete: {
        tags: ['Tags'],
        summary: 'Remueve un tag',
        description: 'Borra información del tag y sus asociaciones',
        operationId: 'deleteTagById',
        parameters: [
          {
            name: 'tagID',
            in: 'path',
            description: 'ID del tipo de tag',
            required: true,
            schema: {
              type: 'string',
              format: 'integer',
            },
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
          },
        },
        security: [
          {
            tokenJWT: [],
          },
        ],
      },
      put: {
        tags: ['Tags'],
        summary: 'Altera los campos del tag',
        description: 'Editará el tag',
        operationId: 'updateTagById',
        parameters: [
          {
            name: 'tagID',
            in: 'path',
            description: 'ID del tipo de tag',
            required: true,
            schema: {
              type: 'string',
              format: 'integer',
            },
          },
        ],
        requestBody: {
          required: true,
          description: 'Se editarán los campos del esquema',
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                $ref: '#/components/schemas/TagUpdate',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'successful operation',
          },
        },
        security: [
          {
            tokenJWT: [],
          },
        ],
      },
    },
    '/countries/': {
      get: {
        tags: ['Countries'],
        summary: 'Devuelve los paises',
        description: 'Retorna los paises',
        operationId: 'getCountries',
        parameters: [
          {
            in: 'query',
            name: 'page',
            description: 'En que vista de la paginación habrá que mostrar.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'size',
            description: 'El número de registros a devolver.',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Vista Paginada',
          },
        },
        security: [
          {
            tokenJWT: [],
          },
        ],
      },
    },
    '/states/': {
      get: {
        tags: ['States'],
        summary: 'Devuelve los estados',
        description: 'Retorna los estados/provincias',
        operationId: 'getStates',
        parameters: [
          {
            in: 'query',
            name: 'page',
            description: 'En que vista de la paginación habrá que mostrar.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'size',
            description: 'El número de registros a devolver.',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Vista Paginada',
          },
        },
        security: [
          {
            tokenJWT: [],
          },
        ],
      },
    },
    '/cities/': {
      get: {
        tags: ['Cities'],
        summary: 'Devuelve las ciudades',
        description: 'Retorna las ciudades',
        operationId: 'getCities',
        parameters: [
          {
            in: 'query',
            name: 'page',
            description: 'En que vista de la paginación habrá que mostrar.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'size',
            description: 'El número de registros a devolver.',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Vista Paginada',
          },
        },
        security: [
          {
            tokenJWT: [],
          },
        ],
      },
    },
    '/roles/': {
      get: {
        tags: ['Roles'],
        summary: 'Devuelve los roles',
        description: 'Retorna los roles',
        operationId: 'getRoles',
        parameters: [
          {
            in: 'query',
            name: 'page',
            description: 'En que vista de la paginación habrá que mostrar.',
            schema: {
              type: 'string',
            },
          },
          {
            in: 'query',
            name: 'size',
            description: 'El número de registros a devolver.',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Vista Paginada',
          },
        },
        security: [
          {
            tokenJWT: [],
          },
        ],
      },
    },
  },
  components: {
    schemas: {
      UserSignUp: {
        required: ['first_name', 'last_name', 'email', 'password'],
        type: 'object',
        properties: {
          first_name: {
            type: 'string',
            example: 'Alexander',
          },
          last_name: {
            type: 'string',
            example: 'Magnus',
          },
          email: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
        },
      },
      UserUpdate: {
        type: 'object',
        properties: {
          first_name: {
            type: 'string',
          },
          last_name: {
            type: 'string',
          },
          code_phone: {
            type: 'string',
          },
          phone: {
            type: 'string',
          },
          interests: {
            type: 'string',
            example: '1,2,4 (ids de los tags separados por comas)',
          },
        },
      },
      UserLogin: {
        required: ['email', 'password'],
        type: 'object',
        properties: {
          email: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
        },
      },
      UserForgetPassword: {
        required: ['email'],
        type: 'object',
        properties: {
          email: {
            type: 'string',
          },
        },
      },
      UserResetPassword: {
        required: ['password'],
        type: 'object',
        properties: {
          password: {
            type: 'string',
          },
        },
      },
      PublicationTypeUpdate: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
        },
      },
      AddPublication: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          content: {
            type: 'string',
          },
          reference_link: {
            type: 'string',
          },
          publication_type_id: {
            type: 'string',
          },
          tags: {
            type: 'string',
            example: '1,2,4 (ids de los tags separados por comas)',
          },
        },
      },
      AddTag: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
        },
      },
      TagUpdate: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
        },
      },
    },
    securitySchemes: {
      tokenJWT: {
        type: 'http',
        description: '<strong>Add JWT Token</strong>',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const swaggerDocs = (app, port) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get('/api-docs/docs.json', (req, res) => {
    res.json(swaggerDocument);
  });
  console.log(
    `Version 1 Docs are available on http://localhost:${port}/api-docs`
  );
};

module.exports = { swaggerDocs };
