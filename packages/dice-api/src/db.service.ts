import { Container, CosmosClient } from '@azure/cosmos';
import { Injectable } from '@nestjs/common';

//define the Roll interface to model how we'll store the results of a dice roll
//The Roll interface has three properties: no. of sides, result of the roll, and timestamp

export interface Roll {
  sides: number;
  result: number;
  timestamp: number;
}

//The MockDbService class is responsible for storing and retrieving the results of dice rolls.
@Injectable()
export class MockDbService {
  private mockDb: Roll[] = [];
  //simple array to store the rolls. When adding new rolls, we'll make sure that the array is
  //sorted by the timestamp property, using the sort method.
  async addRoll(roll: Roll) {
    await this.delay();
    this.mockDb.push(roll);
    this.mockDb.sort((a, b) => a.timestamp - b.timestamp);
  }
  //when getting the last rolls, we'll filter the array to only keep the rolls with the correct
  //number of sides and return the last max rolls.
  // slice() method returns a new array, so we don't have to worry about modifying the original array.
  async getLastRolls(max: number, sides: number) {
    await this.delay();
    // eslint-disable-next-line prettier/prettier
    return this.mockDb.filter((roll) => roll.sides === sides).slice(-max);
  }

  private async delay() {
    return new Promise((resolve) => setTimeout(resolve, 10));
  }
}

@Injectable()
export class DbService {
  client: CosmosClient;
  rolls: Container;

  constructor(connectionString: string) {
    this.client = new CosmosClient(connectionString);
  }

  // added a new method init() to create the database and container if they don't already exist.
  async init() {
    const { database } = await this.client.databases.createIfNotExists({
      id: 'dice-db',
    });
    const { container } = await database.containers.createIfNotExists({
      id: 'rolls',
    });
    this.rolls = container;
  }

  //using the @azure/cosmos SDK to implement the same methods addRoll() and getLastRolls() we used in our MockDbService class..
  async addRoll(roll: Roll) {
    await this.rolls.items.create(roll);
  }

  async getLastRolls(max: number, sides: number) {
    const { resources } = await this.rolls.items
      .query({
        //using a SQL query to retieve the last max rolls with the correct number of sides.
        // it is a parameterized query, which is a good practice to avoid SQL injection attacks.
        query: `SELECT TOP @max * from r WHERE r.sides = @sides ORDER BY r.timestamp DESC`,
        parameters: [
          { name: '@sides', value: sides },
          { name: '@max', value: max },
        ],
      })
      .fetchAll();
    return resources.sort((a, b) => a.timestamp - b.timestamp);
  }
}
