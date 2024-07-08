// retrieves the user settings to get the number of sides of the dice, and then makes multiple
// calls to the Dice API to roll the dice
const config = require('../config');
const { getUserSettings } = require('./settings');


// we're making multiple calls to the Dice API and storing the promises in an array.
async function rollDices(userId, count) {

  // const { sides } = ... is a destructuring assignment, a convienet way to extract values
  // from objects and arrays and assign them to variables.
  // we're extracting the sides property from the object returned by getUserSettings()
  const { sides } = await getUserSettings(userId);
  const promises = [];
  const rollDice = async () => {
    const response = await fetch(`${config.diceApiUrl}/rolls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sides }),
    });
    if (!response.ok) {
      throw new Error(`Cannot roll dice for user ${userId}: ${response.statusText}`);
    }
    const json = await response.json();
    return json.result;
  }

  for (let i = 0; i < count; i++) {
    promises.push(rollDice());
  }
  // using Promise.all() to wait for all promises to resolve before returning the result.
  return { result: await Promise.all(promises) };
}

// retrieves the user settings then makes a call to the Dice API to get the roll history.
async function getRollsHistory(userId, max) {
  max = max ?? '';
  const { sides } = await getUserSettings(userId);
  const response = await fetch(`${config.diceApiUrl}/rolls/history?max=${max}&sides=${sides}`);
  if (!response.ok) {
    throw new Error(`Cannot get roll history for user ${userId}: ${response.statusText}`);
  }
  return response.json();
}

module.exports = {
  rollDices,
  getRollsHistory,
}

