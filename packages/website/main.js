// We'll use JS code to make the glue between our UI and the APIs.
// Using Fetch API to make the HTTP requests, and the DOM API to interact with the UI.


// Start by defining the base URL of our APIs, we get references to the HTML elements we'll need to interact with.
// Azure Static Web Apps, the host, allows to configure a backend API under the /api path.
const apiUrl = '/api';
const sidesInput = document.getElementById('sides');
const countInput = document.getElementById('count');
const maxInput = document.getElementById('max');
const resultDiv = document.getElementById('result');

// similar code we wrote for the gateway service, sexcept that we use the value from our HTML inputs, and output the result
// in the resultDiv element using the innerHTML property
async function getUserSettings() {
  const response = await fetch(`${apiUrl}/settings`);
  if (response.ok) {
    const { sides } = await response.json();
    sidesInput.value = sides;
  } else {
    const message = await response.text();
    resultDiv.innerHTML = `Cannot load user settings ${message}`;
  }
}

async function saveUserSettings() {
  const sides = sidesInput.value;
  const response = await fetch(`${apiUrl}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ sides }),
  });
  if (response.ok) {
    resultDiv.innerHTML = 'User settings saved';
  } else {
    const message = await response.text();
    resultDiv.innerHTML = `Cannot save user settings: ${message}`;
  }
}

async function rollDices() {
  const count = countInput.value;
  const response = await fetch(`${apiUrl}/rolls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ count }),
  });
  if (response.ok) {
    const json = await response.json();
    resultDiv.innerHTML = json.result.join(', ');
  } else {
    const message = await response.text();
    resultDiv.innerHTML = `Cannot roll dices: ${message}`;
  }
}

async function getRollHistory() {
  const max = maxInput.value;
  const response = await fetch(`${apiUrl}/rolls/history?max=${max}`);
  if (response.ok) {
    const json = await response.json();
    resultDiv.innerHTML = json.result.join(', ');
  } else {
    const message = await response.text();
    resultDiv.innerHTML = `Cannot get roll history: ${message}`;
  }
}

// more helper functions to handle the user authentication workflow
// getUser function uses SWA authentication endpoint to get the user's information
async function getUser() {
  try {
    // returns a clientPrincipal object if the user is logged in, otherwise it returns undefined
    const response = await fetch(`/.auth/me`, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    if (response.ok) {
      const json = await response.json();
      return json.clientPrincipal;
    }
  } catch {}
  //returns undefined if the user is not logged in.
  return undefined;
}

//the login/logout functions redirects the user to the login/logout page, using the window.location.href property
// redirects the user to the login page of a specified provider, such as GitHub
function login() {
  window.location.href = `/.auth/login/github`;
}

// redirects the user to the logout page
function logout() {
  window.location.href = `/.auth/logout`;
}

// the main() function that we call at startup first checks if the user is logged in.
// if so, it loads the user settings and displays the user's name in the UI.
// if not, it displays the login button.
// it also sets up event handlers for the login, logout, save, roll, and history buttons.
async function main() {
  // Check if user is logged in
  const user = await getUser();

  if (user) {
    // Load user settings
    await getUserSettings();

    document.getElementById('app').hidden = false;
    document.getElementById('user').innerHTML = user.userDetails;
  } else {
    document.getElementById('login').hidden = false;
  }
  // Setup event handlers
  document.getElementById('loginButton').addEventListener('click', login);
  document.getElementById('logoutButton').addEventListener('click', logout);
  document.getElementById('saveButton').addEventListener('click', saveUserSettings);
  document.getElementById('rollButton').addEventListener('click', rollDices);
  document.getElementById('historyButton').addEventListener('click', getRollHistory);
}

main();


