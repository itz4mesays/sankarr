const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const mongoose = require('mongoose')
const User = require('../models/user')
const UserEnv = require('../models/user_env')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const ConfigSite = require('../models/config_site')
const OptionList = require('../models/option_list')


module.exports = {
  home: async (req, res) => {

    const email = req.user ? req.user.email : null
    const name = req.user ? req.user.name : null

    return res.render('site/index', {
      layout: 'main_layout',
      page_title: 'Login/Register',
      email,
      name
    })
  },
  loggedIn: async (req, res) => {
    User.findOne({ email: req.user.email }).lean().then(user => {

      try{
        // window.localStorage.setItem('storedUid', user._id)
        UserEnv.findOne({ uid: user._id }).lean()
          .then(data => {   
            return res.render('restricted/logged', {
              layout: 'main_layout',
              page_title: 'Logged In',
              user,
              userenv: data,
              email: req.user.email,
              name: user.name
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
              name: user.name,
              userEnv
            })

            

        });  
      }catch(err) {
        return res.sendStatus(404)
      } 
    }else{
      return res.sendStatus(404)
    }

  },
  config: async (req, res) => {

    const user = await User.find({ email: req.user.email }).lean()

    if(!user) return res.sendStatus(404)

    const configList = await ConfigSite.find({uid: user[0]._id},null, {sort: {created_at: -1}})
    
    return res.render('restricted/config_form', {
        layout: 'main_layout',
        page_title: 'Config Site',
        email: req.user.email,
        name: req.user.name,
        id: user[0]._id,
        config_list: configList
    })
  },
  editConfig: async (req, res) => {

    if(!req.params.id) return res.sendStatus(404)

    const config_site = await ConfigSite.find({ _id: req.params.id }).lean()

    if(!config_site) return res.sendStatus(401)

    return res.render('restricted/edit_config', {
        layout: 'main_layout',
        page_title: 'Edit Config',
        email: req.user.email,
        name: req.user.name,
        config: config_site[0]
    })
  },
  fetchList: async (req, res) => {

    const responseReq = await OptionList.find({ type: req.params.type }).lean()
    
    if(!responseReq) res.json({statusCode: 400, message: err})

    return res.json({statusCode: 200, message: responseReq[0].response})

  }
}