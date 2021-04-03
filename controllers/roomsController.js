const { v4: uuidv4 } = require('uuid')
const validator = require('express-validator')
const multer = require('multer')
const Room = require('../models/Room.js')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/rooms/avatars')
  },
  filename: (req, file, cb) => {
    const extArray = file.mimetype.split('/')
    const extension = extArray[extArray.length - 1]
    cb(null, `${uuidv4()}.${extension}`)
  },
})
const upload = multer({ storage })

// Create Room
module.exports.createRoom = [
  upload.single('avatar'),

  // validation rules
  validator
    .body('room_name', 'Please enter the room_name')
    .isLength({ min: 1 }),
  validator
    .body('owner_id', 'Please enter owner_id (ObjectId)')
    .isLength({ min: 1 }),
  validator.body('owner_id').custom((value) => {
    return Room.findOne({ owner_id: value }).then((room) => {
      if (room !== null) {
        return Promise.reject(new Error('Only one room per user allowed'))
      }
    })
  }),
  validator
    .body('owner_name', 'Please enter the owner_name')
    .isLength({ min: 1 }),
  validator.body('room_name').custom((value) => {
    return Room.findOne({ room_name: value }).then((room) => {
      if (room !== null) {
        return Promise.reject(new Error('Room name already taken'))
      }
    })
  }),

  (req, res) => {
    // throw validation errors
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() })
    }

    // initialize record
    const room = new Room({
      room_name: req.body.room_name,
      owner_id: req.body.owner_id,
      owner_name: req.body.owner_name,
      description: req.body.description,
      live: req.body.live,
      avatar: req.file,
    })

    // save record
    room.save((error, room) => {
      if (error) {
        return res.status(500).json({
          message: 'Error saving record',
          error,
        })
      }
      return res.json({
        message: 'Record saved',
        _id: room._id,
      })
    })
  },
]

// Read Room
module.exports.readRoom = async (req, res) => {
  try {
    const room = await Room.findOne({
      room_name: req.headers.room_name,
    }).orFail()
    return res.status(200).json({ room })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

// Read Rooms
module.exports.readRooms = async (req, res) => {
  try {
    const rooms = await Room.find({}).orFail(new Error('No rooms found!'))
    return res.status(200).json({ rooms })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

// Read Rooms Live
module.exports.readRoomsLive = async (req, res) => {
  try {
    const rooms = await Room.find({ live: true }).orFail(
      new Error('No rooms live!')
    )
    return res.status(200).json({ rooms })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
