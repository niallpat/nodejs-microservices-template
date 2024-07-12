/* eslint-disable prettier/prettier */
//create the routes for the API and handle the requests
// add a few imports and configure the logger

import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Logger,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { DbService } from './db.service';

//The RollsController class is responsible for handling the requests to the /rolls route.
// instanciate the logger with the name of the DbService class
@Controller('rolls')
export class RollsController {
  private readonly logger = new Logger(DbService.name);

  constructor(private readonly db: DbService) {}

  //implement the POST /rolls route to roll a dice with a given number of sides
  @Post()
  //the @Body() tells NestJS to get the body of the request, find the sides and pass it to the rollDice method
  // validate that the sides parameter is a number using the ParseIntPipe.
  //we use the built-in NestJS Pipes, a class that implements the PipeTransform interface.
  async rollDice(@Body('sides', ParseIntPipe) sides: number) {
    this.logger.log(`Rolling dice [sides: ${sides}]`);
    //generate a random number between 1 and the number of sides, store it in the db, and return it
    const result = Math.ceil(Math.random() * sides);
    await this.db.addRoll({
      sides: sides,
      timestamp: Date.now(),
      result,
    });
    return { result };
  }

  //add the 'history' route inside the @Get() decorator to handle GET requests to the /rolls/history route
  @Get('history')
  async getRollsHistory(
    //use @QUERY() decorator to get the query parameters of the request and validate then.
    @Query('max', new DefaultValuePipe(10), ParseIntPipe) max: number,
    @Query('sides', new DefaultValuePipe(6), ParseIntPipe) sides: number,
  ) {
    //finally, retrieve the last rolls from the database, return the restuls as an array of numbers.
    this.logger.log(`Retrieving last ${max} rolls history [sides: ${sides}]`);
    const rolls = await this.db.getLastRolls(max, sides);
    //use the map() method to extract the result property from each roll and return it as an array.
    return { result: rolls.map((roll) => roll.result) };
  }
}
