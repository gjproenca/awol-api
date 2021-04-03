const jwt = require('jsonwebtoken')

const config = {
  authSecret: process.env.AUTH_SECRET,
}

module.exports = config

// Check if user is logged in
module.exports.isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    // verify secret and check if the token is expired
    jwt.verify(
      token.replace(/^Bearer\s/, ''),
      config.authSecret,
      // eslint-disable-next-line
      (error, decoded) => {
        if (error) {
          return res.status(401).json({ message: 'unauthorized' })
        } else {
          return next()
        }
      }
    )
  } else {
    return res.status(401).json({ message: 'unauthorized' })
  }
}
