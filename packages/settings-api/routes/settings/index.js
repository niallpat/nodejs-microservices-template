export default async function (fastify, opts) {

  //Define the JSON scheme for the request body of the PUT /:userId route
  const putOptions = {
    schema: {
      body: {
        type: 'object',
        properties: {
          sides: { type: 'number' }
        }
      }
    }
  }

  //retrieve the userId from the URL using :userId
  // no need to import anything to use the logger and the db, as they are provided respectively by the
  // by the request and fastify objects.
  //using the reply object to return the HTTP status 204 (meaning "No Content") response,
  //which is a standard way to return an empty response when we create or update a resource
  //in REST APIs

  fastify.put('/:userId', putOptions, async function (request, reply) {
    request.log.info(`Saving settings for user ${request.params.userId}`);
    await fastify.db.saveSettings(request.params.userId, request.body);
    reply.code(204);
  });

  // add another route to retrieve the settings of a user
  // here we are using the GET HTTP verb, returing the settings of the user if they
  //exist, or a default value if they don't
  fastify.get('/:userId', async function (request, reply) {
    request.log.info(`Retrieving settings for user ${request.params.userId}`);
    const settings = await fastify.db.getSettings(request.params.userId);
    if (settings) {
      return settings;
    }
    return { sides: 6 };
  });


}
