const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Room = new Schema(
  {
    room_name: { type: String, required: true, index: { unique: true } },
    owner_id: { type: mongoose.ObjectId, required: true },
    owner_name: { type: String, required: true },
    description: { type: String },
    live: { type: Boolean, default: false },
    avatar: {
      fieldname: { type: String, required: true },
      originalname: { type: String, required: true },
      encoding: { type: String, required: true },
      mimetype: { type: String, required: true },
      destination: { type: String, required: true },
      filename: { type: String, required: true },
      path: { type: String, required: true },
      size: { type: Number, required: true },
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Room', Room)
