const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Playlist = new Schema(
  {
    playlist_id: { type: String, required: true, index: { unique: true } },
    playlist_items: { type: Object, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Playlist', Playlist)
