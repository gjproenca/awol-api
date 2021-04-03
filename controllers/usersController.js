const validator = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../config.js')
const User = require('../models/User.js')

// Create User
module.exports.createUser = [
  // validations rules
  validator.body('full_name', 'Please enter Full Name').isLength({ min: 1 }),
  validator.body('email', 'Please enter Email').isLength({ min: 1 }),
  validator.body('email').custom((value) => {
    return User.findOne({ email: value }).then((user) => {
      if (user !== null) {
        return Promise.reject(new Error('Email already in use'))
      }
    })
  }),
  validator.body('password', 'Please enter the Password').isLength({ min: 1 }),

  (req, res) => {
    // throw validation errors
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() })
    }

    // initialize record
    const user = new User({
      full_name: req.body.full_name,
      email: req.body.email,
      password: req.body.password,
    })

    // encrypt password
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(user.password, salt)
    user.password = hash

    // save record
    user.save((error, user) => {
      if (error) {
        return res.status(500).json({
          message: 'Error saving record',
          error,
        })
      }
      return res.json({
        message: 'Record saved',
        _id: user._id,
      })
    })
  },
]

// Sign in
module.exports.signIn = [
  // validation rules
  validator.body('email', 'Please enter Email').isLength({ min: 1 }),
  validator.body('password', 'Please enter Password').isLength({ min: 1 }),

  (req, res) => {
    // throw validation errors
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() })
    }

    // validate email and password are correct
    User.findOne({ email: req.body.email }, (error, user) => {
      if (error) {
        return res.status(500).json({
          message: 'Error logging in',
          error,
        })
      }

      if (user === null) {
        return res.status(500).json({
          message: 'Email not found',
        })
      }

      // compare submitted password with password inside db
      return bcrypt.compare(
        req.body.password,
        user.password,
        (error, isMatched) => {
          if (error) {
            return res.status(500).json({
              message: 'Error logging in',
              error,
            })
          }

          if (isMatched === true) {
            return res.json({
              user: {
                _id: user._id,
                email: user.email,
                full_name: user.full_name,
              },
              token: jwt.sign(
                { _id: user._id, email: user.email, full_name: user.full_name },
                config.authSecret
              ), // generate JWT token here
            })
          } else {
            return res.status(500).json({
              message: 'Invalid Email or Password',
            })
          }
        }
      )
    })
  },
]

// Read User
module.exports.readUser = (req, res) => {
  const token = req.headers.authorization
  if (token) {
    // verifies secret and checks if the token is expired
    jwt.verify(
      token.replace(/^Bearer\s/, ''),
      config.authSecret,
      (error, decoded) => {
        if (error) {
          return res.status(401).json({ message: 'unauthorized' })
        } else {
          return res.json({ user: decoded })
        }
      }
    )
  } else {
    return res.status(401).json({ message: 'unauthorized' })
  }
}
