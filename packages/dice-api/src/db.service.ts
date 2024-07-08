import { Injectable } from '@nestjs/common';

//define the Roll interface to model how we'll store the results of a dice roll
//The Roll interface has three properties: no. of sides, result of the roll, and timestamp

export interface Roll {
  sides: number;
  result: number;
  timestamp: number;
}

//The DbService class is responsible for storing and retrieving the results of dice rolls.
@Injectable()
export class DbService {
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
    return this.mockDb
    .filter((roll) => roll.sides === sides)
    .slice(-max);
  }

  private async delay() {
    return new Promise((resolve) => setTimeout(resolve, 10));
  }
}
