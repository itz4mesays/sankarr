const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const mongoose = require('mongoose')
const User = require('../models/user')
const UserEnv = require('../models/user_env')

module.exports = {
  list_users: async (req, res) => {
    return res.render('admin/list-user', {
      layout: 'main_layout',
      page_title: 'List Users',
    })
  },
}