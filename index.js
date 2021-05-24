const express = require('express')
const port = process.env.PORT || 3000
const cors = require('cors')
require('./db.js') // import DB

// Require & Import API routes
const users = require('./routes/users.js')
const rooms = require('./routes/rooms.js')
const playlists = require('./routes/playlists.js')

// Create express instance
const app = express()

// enable CORS without external module
app.use(cors())

// Init body-parser options (inbuilt with express)
app.use(express.json({ limit: '50mb', type: 'application/json' }))
app.use(express.urlencoded({ extended: true }))

// Use API Routes
app.use(users)
app.use(rooms)
app.use(playlists)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
