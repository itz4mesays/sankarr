const mongoose = require('mongoose')

const ConfigSiteSchema = new mongoose.Schema({
    uid: {
        type: Number,
        required: true,
        trim: true
    },
    req: {
        type: String,
        required: true,
        trim: true
    },
    response: {
        type: Object,
        required: true,
        trim: true
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

const User = mongoose.model('ConfigSite', ConfigSiteSchema)

module.exports = ConfigSite
