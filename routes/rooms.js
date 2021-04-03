const path = require('path')
const { Router } = require('express')
const config = require('../config.js')

const router = Router()

// Initialize controller
const roomsController = require('../controllers/roomsController.js')

// Create room
router.post('/room', config.isAuthenticated, roomsController.createRoom)

// Read room
router.get('/room', config.isAuthenticated, roomsController.readRoom)

// Read rooms
router.get('/rooms', config.isAuthenticated, roomsController.readRooms)

// Read Rooms live
router.get('/rooms/live', config.isAuthenticated, roomsController.readRoomsLive)

// Read avatar
router.get('/room/avatar/:avatarName', (req, res) => {
  res.sendFile(
    path.resolve(
      `${__dirname}'../../../uploads/rooms/avatars/${req.params.avatarName}`
    )
  )
})

module.exports = router
