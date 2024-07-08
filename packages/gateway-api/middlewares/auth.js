// Retrieve user from Static Web Apps authentication header
// this helper function will retrieve the user id from the authentication header
// 'x-ms-client-principal' and return it.
// the header is a base64 encoded JSON string containing the user info
//we need to decode it and parse it to get the user object.
function getUser(req) {
  try {
    const header = req.headers['x-ms-client-principal'];
    const principal = Buffer
      .from(header, 'base64')
      .toString('ascii');

      // the optional chaining operation ?. allows to safely access nested properties
      // of an object without throwing an error, returning undefined if the property
      // is not found.
    if (principal) {
      return JSON.parse(principal)?.userId;
    }
  } catch (error) {
    req.log.error('Cannot get user', error);
  }
  return undefined;
}

// Middleware to check if user is authenticated
// an Express middleware is a function that takes 3 arguements: tje request object,
// the response object and a next function. It can modify the request and response
// it can optionally call the next() function to pass control to the next middleware
function auth(req, res, next) {
  req.user = getUser(req);
  if (!req.user) {
    //retrieves the user info from the request, if it' not available, returns a 401 status code
    return res.sendStatus(401);
  }
  next();
}

module.exports = auth;

