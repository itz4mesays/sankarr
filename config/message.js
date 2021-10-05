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
  console.log("User Details call")
  userurl = "https://graph.facebook.com/"+sender+"?fields=first_name,last_name,profile_pic,locale,timezone,gender,email&access_token="+token
  request({
    method:"GET",
    url: userurl
  }).then(function (response) {
    // localStorage.setItem('storedUserInfo', response.body);
    console.log("User Details "+response.body)
    // return response.body;
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
const sendPostbackResponse = (sender, token, data) => {
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
  // sendAutoMessage(sender, token, data)
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
    sendAutoMessage
}
// module.exports.adminLogged = adminLogged