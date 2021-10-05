const mongoose = require('mongoose')

const UserEnvSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        trim: true
    },
    profileapi_key: {
        type: String,
        required: true,
        trim: true
    },    
    custom_webhook: {
        type: String,
        required: true,
        trim: true
    },
    access_token: {
        type: String,
        required: true,
        trim: true
    },
    page_token: {
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
}, {collection: 'user_env'})

const UserEnv = mongoose.model('UserEnv', UserEnvSchema)

module.exports = UserEnv
