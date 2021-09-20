const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const mongoose = require('mongoose')
const User = require('../models/user')
const UserEnv = require('../models/user_env')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

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
              email: req.user.email
            })

        });  
      }catch(err) {
        res.sendStatus(404)
      } 

    }).catch(err => res.sendStatus(404))
  },
  edit: async (req, res) => {

    // const userenv = await UserEnv.findOne({ uid: req.params.id }).lean();

    const user = await User.findOne({ _id: req.params.id }).lean();

    if(user){
      try{

        UserEnv.findOne({ uid: user._id }).lean()
          .then(data => {

            let userEnv = {}
            const token = jwt.sign({ user: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '365d' })
            const refreshToken = jwt.sign({ user: user.email }, process.env.ACCESS_REFRESH_TOKEN)

            if(!data){
              userEnv = {
                profileapi_key: token,
                access_token: null,
                page_token: null,
                status: 0
              }
            }else{
              userEnv = {
                profileapi_key: data.profileapi_key,
                access_token: data.access_token,
                page_token: data.page_token,
                status: data.status
              }
            }

            return res.render('restricted/edit', {
              layout: 'main_layout',
              page_title: 'Edit',
              user,
              email: user.email,
              userEnv
            })

            

        });  
      }catch(err) {
        return res.sendStatus(404)
      } 
    }else{
      return res.sendStatus(404)
    }

  }
}