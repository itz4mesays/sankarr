const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const mongoose = require('mongoose')
const User = require('../models/user')
const UserEnv = require('../models/user_env')
const ConfigSite = require('../models/config_site')
const { isPhoneValid, isEmailValid, getUserInfo, sendQuickReplyMessage, sendActionTyping, sendPostbackResponse, sendTextMessage, sendButtonMessage, sendImageMessage, sendVideoMessage, sendFeedbackMessage, sendGenericMessage, sendOrderMessage } = require('../../config/message');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

module.exports = {
  list_users: async (req, res) => {
    const storedEmail = localStorage.getItem('storedEmail')
    const perPage = 20
    const page = req.query.p
    // const storedUid = window.localStorage.getItem('storedUid')
    User.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .lean()
      .exec(function (err, data) {
        User.countDocuments().exec(function (err, count) {
          if (err) {
              return res.sendStatus(401)
          }
          if(storedEmail != req.params.email){
            return res.sendStatus(401)
          }
          res.render('admin/list-user', {
              layout: 'admin_layout',
              pagination: {
                  page: req.query.p || 1,
                  pageCount: Math.ceil(count / perPage)
              },
              data,
              email: req.params.email,
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
    console.log("Calling Webhook")
    /**
     * Find the profileapi_key is valid
     * check if both access_token and page_token matches the customer with the return id from step 1
     * check the the corresponding value for req inside the config table and return response
     */
    // UserEnv.findOne({profileapi_key: req.params.profileapi_key, access_token: req.body.access_token, page_token : req.body.page_token}).lean().then(user => {
    //     if(!user) return res.json({statusCode: 400, message: 'Sorry we could not match the token you provided with any user'})

    //     if(user.status === 1) res.json({statusCode: 400, message: 'This route API cannot be executed at the moment'})

    //     ConfigSite.findOne({uid: user.uid, req: req.body.req_param}).lean().then(configSite => {
    //         if(!configSite) return res.json({statusCode: 400, message: 'Sorry no response was found'})

    //         return res.json({statusCode: 200, message: {response: configSite.response}})

    //     }).catch(err => {
    //         return res.json({statusCode: 400, message: err})
    //     })
    // }).catch(err => {
    //     return res.json({statusCode: 400, message: err})
    // })
    UserEnv.findOne({profileapi_key: req.params.profileapi_key}).lean().then(user_env => {
      token = user_env.page_token
      custom_webhook = null
      if(user_env.custom_webhook){
        // console.log("YEs Custom hook available")
        custom_webhook = user_env.custom_webhook.trim()
      }
      messaging_events = req.body.entry[0].messaging
      for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        recipient = event.recipient.id
        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        console.log(JSON.stringify(event))
        console.log(JSON.stringify(event.message))
        if (event.postback) {
            // console.log("Postback"+ JSON.stringify(event.postback))
            // Get the payload for the postback
            let payload = event.postback.payload;
            postback_data = payload
            if(payload === 'GET_STARTED'){
              postback_data = 'welcome'
            }
            ConfigSite.findOne({uid: user_env.uid, req: postback_data}).lean().then(configSite => {
              responseData = configSite.response
              requestType = configSite.rtype   
              // console.log(responseData)
              getUserInfo(sender, token)
              sendActionTyping(sender, token, "typing_on")
              sendPostbackResponse(sender, token, responseData, null, null, null, null, null)
              sendActionTyping(sender, token, "typing_off")
            }).catch(err => {
                // return res.json({statusCode: 400, message: err})
                console.log("Postback ERROR - Catch Exception"+ err)
            })
        }      
        else if (event.message && event.message.text && (!event.message.is_echo)) {
            if (event.message.quick_reply){   
              if (event.message.nlp.entities.phone_number || event.message.nlp.entities.email || event.message.nlp.entities['wit$phone_number:phone_number'] || event.message.nlp.entities['wit$email:email']){
                console.log("NLP Fall ")
                if (event.message.nlp.entities.phone_number || event.message.nlp.entities['wit$phone_number:phone_number']){ 
                  requestData="next_to_phone"
                  localStorage.setItem('phone', event.message.text)
                }
                if (event.message.nlp.entities.email || event.message.nlp.entities['wit$email:email']){ 
                  requestData="next_to_email"
                  localStorage.setItem('email', event.message.text)
                }
              }
              else{    
                requestData = event.message.quick_reply.payload
                console.log("Quick reply")
                console.log("Message"+ JSON.stringify(event.message))
              }
            }
            else{
              // var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
              requestData = event.message.text
              validEmail = isEmailValid(requestData)
              if(validEmail){
                // console.log("Valid Email")
                localStorage.setItem('email', requestData)
                requestData="next_to_email"
              }
              else{
                validPhone = isPhoneValid(requestData)
                if(validPhone){
                  localStorage.setItem('phone', requestData)
                  requestData="next_to_phone"
                  // console.log("Valid Phone")
                }
                // else{
                //   console.log("Not a Valid phone")
                // }
              }
              console.log("Normal reply")
            }
          console.log("requestData : "+ requestData)
          ConfigSite.findOne({uid: user_env.uid, req: requestData}).lean().then(configSite => {
            // console.log("Message"+ JSON.stringify(event.message))
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
            if ((requestType === 'email') || (requestType === 'phone') || (requestType === 'yes_no')){
                // console.log(event.message.quick_reply.payload)
                // console.log(event.message.text)
                sendQuickReplyMessage(sender, token, responseData)
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
              // return res.json({statusCode: 400, message: err})
              console.log("Message ERROR - Catch Exception"+ err)
              console.log("From Catch block"+ JSON.stringify(event.message))
              // responseData = {
              //     text:"Your message is not able to handle, please start the discussion again from bottom right menu."
              // }
              // sendPostbackResponse(sender, token, responseData)              
              })
        }
        if(event.hasOwnProperty('messaging_feedback')){
          // var replyMsg = '{"messaging_type": "RESPONSE","recipient": {"id": '+recipient+'},"message": {"text": "Your feedback received, Thanks for your feedback"}}';          
          // sendTextMessage(sender, token, "Your feedback received, Thanks for your feedback")
          responseData = {
              text:"Your feedback received, Thanks for your feedback"
          }
          var feedback_collection= [];
          qn_type=event.messaging_feedback.feedback_screens[0].questions.hauydmns8.type
          rating=event.messaging_feedback.feedback_screens[0].questions.hauydmns8.payload
          type=event.messaging_feedback.feedback_screens[0].questions.hauydmns8.follow_up.type
          feedback_msg=event.messaging_feedback.feedback_screens[0].questions.hauydmns8.follow_up.payload
          // feedback_collection.push(feedback)
          sendPostbackResponse(sender, token, responseData, custom_webhook, qn_type, rating, type, feedback_msg)
          // console.log(event.messaging_feedback.feedback_screens[0].questions.hauydmns8.type);
          // console.log(event.messaging_feedback.feedback_screens[0].questions.hauydmns8.payload);
          // console.log(event.messaging_feedback.feedback_screens[0].questions.hauydmns8.follow_up.type);
          // console.log(event.messaging_feedback.feedback_screens[0].questions.hauydmns8.follow_up.payload);
        }
      }
      res.sendStatus(200)            
    }).catch(err => {
        return res.json({statusCode: 400, message: err})
    })
    // return res.json({statusCode: 200})
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
