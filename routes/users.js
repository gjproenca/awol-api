const { Router } = require('express')
const config = require('../config.js')

const router = Router()

// Initialize Controller
const usersController = require('../controllers/usersController.js')

// Create User
router.post('/user', usersController.createUser)

// Sign in
router.post('/user/sign-in', usersController.signIn)

// Read User
router.get('/user', config.isAuthenticated, usersController.readUser)

module.exports = router
