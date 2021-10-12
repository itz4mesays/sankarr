var request = require('request')
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
const sendTextMessage = (sender, token, data) => {
  // messageData = {
  //     text:data
  // }
  sendAutoMessage(sender, token, data)
}
const sendActionTyping = (sender, token, data) => {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
        recipient: {id:sender},
        sender_action: data,
    }
  }, function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: in sendActionTyping ', response.body.error)
      }
  })  
}
const getUserInfo = (sender, token) => {
  // console.log("User Details call")
  userurl = "https://graph.facebook.com/"+sender+"?fields=first_name,last_name,profile_pic,locale,timezone,gender,email&access_token="+token
  request({
    method:"GET",
    url: userurl
  }, function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: in sendQuickReplyMessage ', response.body.error)
      }
      out = JSON.parse(response.body)
      // console.log(response.body.first_name+" - "+response.body.last_name+" - "+response.body.locale+" - "+response.body.timezone+" - "+response.body.gender+" - "+response.body.id+" - "+response.body.profile_pic)
      localStorage.setItem('first_name', out.first_name);
      localStorage.setItem('last_name', out.last_name);
      localStorage.setItem('locale', out.locale);
      localStorage.setItem('timezone', out.timezone);
      localStorage.setItem('gender', out.gender);
      localStorage.setItem('id', out.id);
      localStorage.setItem('profile_pic', out.profile_pic);
  })
}
const sendQuickReplyMessage = (sender, token, data) => {
  messageData = {
    recipient: {id:sender},
    messaging_type: "RESPONSE",
    message:data
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: messageData
  }, function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: in sendQuickReplyMessage ', response.body.error)
      }
  })
}
const sendPostbackResponse = (sender, token, data, custom_webhook, qn_type, rating, type, feedback_msg) => {
  console.log("Post back response from Message.js")
  messageData = {
    recipient: {id:sender},
    messaging_type: "RESPONSE",
    message:data
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: messageData
  }, function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: in sendQuickReplyMessage ', response.body.error)
      }
  })  
  if(custom_webhook){
    // Reading LocalStorage
    const first_name = localStorage.getItem('first_name')
    const last_name = localStorage.getItem('last_name')
    const locale = localStorage.getItem('locale')
    const timezone = localStorage.getItem('timezone')
    const gender = localStorage.getItem('gender')
    const id = localStorage.getItem('id')
    const profile_pic = localStorage.getItem('profile_pic')
    const email = localStorage.getItem('email')
    const phone = localStorage.getItem('phone')
    messageData = {
      recipient: {id:sender},
      messaging_type: "RESPONSE",
      message:{
        first_name:first_name,
        last_name:last_name,
        locale:locale,
        timezone:timezone,
        gender:gender,
        id:id,
        profile_pic:profile_pic,
        email:email,
        phone:phone,
        feedback: {
          qn_type: qn_type, 
          rating: rating, 
          type: type, 
          feedback_msg: feedback_msg
        }
      }
    }
    if(email){
      request({
        url: custom_webhook,
        method: 'POST',
        json: messageData
      }, function(error, response, body) {
          if (error) {
              console.log('Error sending messages: ', error)
          } else if (response.body.error) {
              console.log('Error: in sendQuickReplyMessage ', response.body.error)
          }
      })    
    }
  }
  // sendAutoMessage(sender, token, data)
}
const isEmailValid =(email) => {
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (!email)
        return false;

    if(email.length>254)
        return false;

    var valid = emailRegex.test(email);
    if(!valid)
        return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if(parts[0].length>64)
        return false;

    var domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
        return false;

    return true;
}
const sendButtonMessage = (sender, token, data) => {
    sendAutoMessage(sender, token, data)
}
const sendImageMessage = (sender, token, data) => {
    sendAutoMessage(sender, token, data)
}
const sendVideoMessage = (sender, token, data) => {
    sendAutoMessage(sender, token, data)
}
const sendFeedbackMessage = (sender, token, data) => {
    sendAutoMessage(sender, token, data)
}
const sendGenericMessage = (sender, token, data) => {
    // console.log("GridMessageData:" + data)
    sendAutoMessage(sender, token, data)
}
const sendOrderMessage = (sender, token, data) => {
    messageData = {
    "attachment":{
        "type":"template",
        "payload":data
    }
  }
  // console.log("OrdermessageData:" + messageData)
    sendAutoMessage(sender, token, data)
}

const sendAutoMessage = (sender, token, messageData) => {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
        recipient: {id:sender},
        message: messageData,
    }
  }, function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: ', response.body.error)
      }
  })
}
module.exports = {
    sendTextMessage,
    getUserInfo,
    sendPostbackResponse,
    sendActionTyping,
    sendButtonMessage,
    sendImageMessage,
    sendVideoMessage,
    sendFeedbackMessage,
    sendGenericMessage,
    sendOrderMessage,
    sendQuickReplyMessage,
    sendAutoMessage,
    isEmailValid
}
// module.exports.adminLogged = adminLogged