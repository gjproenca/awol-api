const validator = require('express-validator')
const Playlist = require('../models/Playlist.js')

// Create Playlist
// FIXME: trasnform from array to function
module.exports.createPlaylist = [
  // Validation rules
  validator
    .body('playlist_id', 'Please enter the playlist id')
    .isLength({ min: 1 }),
  validator
    .body('playlist_items', 'Please enter the playlist items')
    .isLength({ min: 1 }),
  (req, res) => {
    // Throw validation errors
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() })
    }

    // Initialize record
    const playlist = new Playlist({
      playlist_id: req.body.playlist_id,
      playlist_items: req.body.playlist_items,
    })

    // Save record
    playlist.save((error, playlist) => {
      if (error) {
        return res.status(500).json({
          message: 'Error saving record',
          error,
        })
      }
      return res.json({
        message: 'Record saved',
        _id: playlist._id,
      })
    })
  },
]

// Read Playlist
module.exports.readPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({
      playlist_id: req.headers.playlist_id,
    }).orFail()
    return res.status(200).json({ playlist })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

// Delete playlist
module.exports.deletePlaylist = async (req, res) => {
  try {
    await Playlist.findOneAndDelete({
      playlist_id: req.params.playlist_id,
    }).orFail(new Error('Playlist not found'))

    return res
      .status(200)
      .json({ message: 'Record deleted', playlist_id: req.params.playlist_id })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
