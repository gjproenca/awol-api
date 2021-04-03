const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    // TODO: create activate account trough email and endpoint logic
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', User)
