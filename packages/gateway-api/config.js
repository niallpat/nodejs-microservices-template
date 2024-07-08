//Adding service URLs to the config object allows you to easily change them in the future without modifying the code.
//The Settings API URL is not hardcoded in the code, but is retrieved from the config object.
// we try to read the URLs from the environment variables SETTINGS_API_URL and DICE_API_URL.

module.exports = {
  settingsApiUrl: process.env.SETTINGS_API_URL || 'http://localhost:4001',
  diceApiUrl: process.env.DICE_API_URL || 'http://localhost:4002'
};
