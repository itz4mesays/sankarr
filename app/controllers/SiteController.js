const mongoose = require('mongoose')
// const User = require('../models/user')

module.exports = {
  home: async (req, res) => {
    return res.render('site/index', {
      layout: 'main_layout',
      page_title: 'Login/Register',
    })
  },
  loggedIn: async (req, res) => {
    let name = req.user.displayName
    let email = req.user.email

    return res.render('restricted/logged', {
      layout: 'main_layout',
      page_title: 'Logged In',
      name,
      email
    })
  }
}