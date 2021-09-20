const mongoose = require('mongoose')
const User = require('../models/user')
const UserEnv = require('../models/user_env')
const crypto = require('crypto')

module.exports = {
  home: async (req, res) => {
    return res.render('site/index', {
      layout: 'main_layout',
      page_title: 'Login/Register',
    })
  },
  loggedIn: async (req, res) => {
    User.findOne({ email: req.user.email }).lean().then(user => {

      try{

        UserEnv.findOne({ uid: user._id }).lean()
          .then(data => {   
            return res.render('restricted/logged', {
              layout: 'main_layout',
              page_title: 'Logged In',
              user,
              userenv: data,
              email: req.user.email ? req.user.email : null
            })

        });  
      }catch(err) {
        res.sendStatus(404)
      } 

    }).catch(err => res.sendStatus(404))
  },
  edit: async (req, res) => {
    
    const userenv = await UserEnv.findOne({ uid: req.params.id }).lean();

    User.findOne({ email: req.user.email }).lean().then(user => {
      return res.render('restricted/edit', {
        layout: 'main_layout',
        page_title: 'Edit',
        userenv,
        profileapi_key: userenv.profileapi_key ?? crypto.randomBytes(18).toString('hex'),
        user,
        email: req.user.email ? req.user.email : null
      })
    }).catch(err => res.sendStatus(404))

    

  }
}