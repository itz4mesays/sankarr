const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    status: {
      type: Number,
      required: true,
      trim: true,
      default: 0
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    site_1: {
        type: Number,
        required: true,
        trim: true,
        default: 1
    },
    last_login: {
        type: Date,
        trim: true,
      },
    created_at: {
      type: Date,
      required: true,
      trim: true,
      default: Date.now()
    },
    updated_at: {
      type: Date,
      required: true,
      trim: true,
      default: Date.now()
    }
}, {collection: 'user'})

const User = mongoose.model('User', UserSchema)

module.exports = User
