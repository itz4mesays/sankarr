const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const mongoose = require('mongoose')
const User = require('../models/user')
const UserEnv = require('../models/user_env')
const ConfigSite = require('../models/config_site')
const { sendTextMessage } = require('../../config/message');

module.exports = {
  list_users: async (req, res) => {

    const perPage = 20
    const page = req.query.p

    User.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .lean()
      .exec(function (err, data) {
        User.countDocuments().exec(function (err, count) {
          if (err) {
              return res.sendStatus(401)
          }

          res.render('admin/list-user', {
              layout: 'main_layout',
              pagination: {
                  page: req.query.p || 1,
                  pageCount: Math.ceil(count / perPage)
              },
              data,
              page_title: 'Dashboard'
          })
      })
    })
  },
  update: async (req, res) => {

    let stat = (req.body.val == 1 )? 0 : 1
    const filter = { _id: req.body.id}
    const options = { new: true } //this is set to true for the saved response to be return if needed

    //When user.status is updated, user_env.status too should be updated
    if(req.body.col == 'user_status'){
      const update = {status: stat}

      User.findOneAndUpdate(filter, update, options, (err, result) => {
          if (err) return res.json({statusCode: 400, message: err})

          const filter2 = { uid: req.body.id}
          UserEnv.findOneAndUpdate(filter2, update, options, (err, result) => {
              if (err) return res.json({statusCode: 400, message: 'Unable to find a user env record for this user' + err})
              
              return res.json({statusCode: 200, message: 'Update completed and user env has been saved'})
              
          })
      })

    }else{
      //First check if the userid exist in the user table before updating the site_1 column in the user table
      const update = {site_1: stat}

      User.findOneAndUpdate(filter, update, options, (err, result) => {
          if (err) return res.json({statusCode: 400, message: err})

          return res.json({statusCode: 200, message: 'Update completed'})
      })
    }
  },
  webhook: async (req, res) => { 
    /**
     * Find the profileapi_key is valid
     * check if both access_token and page_token matches the customer with the return id from step 1
     * check the the corresponding value for req inside the config table and return response
     */
     console.log("Profile key:" + req.params.profileapi_key);
    UserEnv.findOne({profileapi_key: req.params.profileapi_key}).lean().then(user_env => {
      token = user_env.page_token
      console.log("token key:" + token);
      messaging_events = req.body.entry[0].messaging
      for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
          requestData = event.message.text

          ConfigSite.findOne({uid: user_env.uid, req: event.message.text}).lean().then(configSite => {
            responseData = configSite.response
            requestType = configSite.rtype
            if (requestType === 'text') {
                sendTextMessage(sender, token, responseData.substring(0, 200))
                // continue
            }
            if (requestType === 'button') {
                sendButtonMessage(sender, token, responseData)
                // continue
            }
            if (requestType === 'image') {
                sendImageMessage(sender, token, responseData)
                // continue
            }
            if (requestType === 'video') {
                sendVideoMessage(sender, token, responseData)
                // continue
            }
            if (requestType === 'feedback') {
                sendFeedbackMessage(sender, token, responseData)
                // continue
            }
            if (requestType === 'grid') {
                sendGenericMessage(sender, token, responseData)
                // continue
            }
            if (requestType === 'order') {
                sendOrderMessage(sender, token, responseData)
                // continue
            }
          }).catch(err => {
              return res.json({statusCode: 400, message: err})
          })
        }
        // if (event.postback) {
        //     text = JSON.stringify(event.postback)
        //     sendTextMessage(sender, token, "Postback received: "+text.substring(0, 200))
        //     continue
        // }
      }
      res.sendStatus(200)            
    }).catch(err => {
        return res.json({statusCode: 400, message: err})
    })
  },
  getwebhook: async (req, res) => {
    /**
     * Find the profileapi_key is valid
     * check if both access_token and page_token matches the customer with the return id from step 1
     * check the the corresponding value for req inside the config table and return response
     */
    UserEnv.findOne({profileapi_key: req.params.profileapi_key}).lean().then(user_env => {
      if(!user_env) res.send('Error, No details are there')
      if(user_env.status === 1) res.send('Error, Forbidden')
      
      if (req.query['hub.verify_token'] === user_env.access_token) {
          res.send(req.query['hub.challenge'])
      }
      else{
        res.send('Error, wrong token')
      }
    }).catch(err => {
        return res.json({statusCode: 400, message: err})
    })

  }
}
