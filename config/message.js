var request = require('request')

const sendTextMessage = (sender, token, data) => {
  messageData = {
      text:data
  }
  sendAutoMessage(sender, token, messageData)
}
const sendButtonMessage = (sender, token, data) => {
  console.log('sendButtonMessage'+data)
    messageData = {
        "attachment":{
          "type":"template",
          "payload": data
        }
    }
    sendAutoMessage(sender, token, messageData)
}
const sendImageMessage = (sender, token, data) => {
    messageData = {
      "attachment":{
        "type":"template",
        "payload":{
          "template_type": "media",
          "elements": data
        }
      }
    }
    sendAutoMessage(sender, token, messageData)
}
const sendVideoMessage = (sender, token, data) => {
    messageData = {
      "attachment":{
        "type":"template",
        "payload":{
          "template_type": "media",
          "elements": data
        }
      }
    }
    sendAutoMessage(sender, token, messageData)
}
const sendFeedbackMessage = (sender, token, data) => {
    messageData = {
      "attachment":{
          "type":"template",
          "payload": data
      }
    }
    sendAutoMessage(sender, token, messageData)
}
const sendGenericMessage = (sender, token, data) => {
    // messageData = {
    //   "attachment": {
    //       "type": "template",
    //       "payload": data
    //   }
    // }
    sendAutoMessage(sender, token, data)
}
const sendOrderMessage = (sender, token, data) => {
    messageData = {
    "attachment":{
        "type":"template",
        "payload":data
    }
  }
    sendAutoMessage(sender, token, messageData)
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
    sendButtonMessage,
    sendImageMessage,
    sendVideoMessage,
    sendFeedbackMessage,
    sendGenericMessage,
    sendOrderMessage,
    sendAutoMessage
}
// module.exports.adminLogged = adminLogged