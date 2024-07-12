import { CosmosClient } from '@azure/cosmos';
import fp from 'fastify-plugin'
// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

// we're checking if the DATABASE_CONNECTION_STRING environment variable is set.
// If it is, we're creating a new instance of the Database class and calling the init() method.
// If it's not, we're creating a new instance of the MockDatabase class.
export default fp(async function (fastify, opts) {
  const connectionString = process.env.DATABASE_CONNECTION_STRING;
  if (connectionString) {
    const db = new Database(connectionString);
    await db.init();
    fastify.decorate('db', db);
    fastify.log.info('Connection to database successful.');
  } else {
    fastify.decorate('db', new MockDatabase());
    fastify.log.warn('No DB connection string provided, using mock database.');
  }
});


class MockDatabase {
  constructor() {
    this.db = {};
  }

  async saveSettings(userId, settings) {
    await this.#delay();
    this.db[userId] = settings;
  }

  async getSettings(userId) {
    await this.#delay();
    return this.db[userId];
  }

  async #delay() {
    return new Promise(resolve => setTimeout(resolve, 10));
  }
}

class Database {
  constructor(connectionString) {
    this.client = new CosmosClient(connectionString)
  }
  // we've added a new method init() to the Database class that creates the database and container if they don't exist.
  async init() {
    const { database } = await this.client.databases.createIfNotExists({
      id: 'settings-db'
    });
    //because Azure Cosmos DB is a NoSQL db, we also need to create a container to store the data.
    //a container is a place to store a collection of documents, called items.
    const { container } = await database.containers.createIfNotExists({
      id: 'settings'
    });
    this.settings = container;
  }

  //we're using the @azure/cosmos SDK to implement the same methods saveSettings() and getSettings() as in the MockDatabase class
  async saveSettings(userId, settings) {
    await this.settings.items.upsert({ id: userId, settings });
  }

  async getSettings(userId) {
    const { resource } = await this.settings.item(userId).read();
    return resource?.settings;
  }
}

