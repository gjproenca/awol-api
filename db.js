const mongoose = require('mongoose')

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

const db = mongoose.connection
db.on('error', () => console.log('MongoDB Connection Error'))
db.once('open', () => {
  console.log('MongoDB Connected on http://localhost:3000')
})

module.exports = db
