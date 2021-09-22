const mongoose = require('mongoose')

const OptionListSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        trim: true
    },
    response: {
        type: String,
        required: true,
        trim: true
    }
}, {collection: 'option_list'})

const OptionList = mongoose.model('OptionList', OptionListSchema)

module.exports = OptionList
