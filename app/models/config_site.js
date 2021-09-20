const mongoose = require('mongoose')

const ConfigSiteSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        trim: true
    },
    rtype: {
        type: String,
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
}, {collection: 'config_site'})

const ConfigSite = mongoose.model('ConfigSite', ConfigSiteSchema)

module.exports = ConfigSite
