const { Router } = require('express')
const config = require( '../config.js')

const router = Router()

// Initialize controller
const playlistsController = require('../controllers/playlistsController.js')

// Create playlist
router.post(
  '/playlist',
  config.isAuthenticated,
  playlistsController.createPlaylist
)

// Read playlist
router.get(
  '/playlist',
  config.isAuthenticated,
  playlistsController.readPlaylist
)

// Delete playlist
router.delete(
  '/playlist/:playlist_id',
  config.isAuthenticated,
  playlistsController.deletePlaylist
)

module.exports = router
