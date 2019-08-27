const mongoose = require('mongoose')
const path = require('path')

const coverImageBasePath = 'uploads/userCovers'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  coverImageName: {
    type: String,
    required: true
  }
})

userSchema.virtual('coverImagePath').get(function() {
  if (this.coverImageName != null) {
    return path.join('/', coverImageBasePath, this.coverImageName)
  }
})


module.exports = mongoose.model('user', userSchema)
module.exports.coverImageBasePath = coverImageBasePath