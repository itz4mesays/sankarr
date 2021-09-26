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
    messageData = JSON.stringify(messageData, null, 4)
    messageData = messageData.replace(/\\n/g, '').replace(/\\r/g, '')
    console.log("ButtonmessageData:" + messageData)
    sendAutoMessage(sender, token, data)
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
    console.log("ImagemessageData:" + messageData)
    sendAutoMessage(sender, token, data)
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
    console.log("VideomessageData:" + messageData)
    sendAutoMessage(sender, token, data)
}
const sendFeedbackMessage = (sender, token, data) => {
    messageData = {
      "attachment":{
          "type":"template",
          "payload": data
      }
    }
    console.log("FeedbackmessageData:" + messageData)
    sendAutoMessage(sender, token, data)
}
const sendGenericMessage = (sender, token, data) => {
    // messageData = {
    //   "attachment": {
    //       "type": "template",
    //       "payload": data
    //   }
    // }
    console.log("GridMessageData:" + data)
    sendAutoMessage(sender, token, data)
}
const sendOrderMessage = (sender, token, data) => {
    messageData = {
    "attachment":{
        "type":"template",
        "payload":data
    }
  }
  console.log("OrdermessageData:" + messageData)
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
    sendButtonMessage,
    sendImageMessage,
    sendVideoMessage,
    sendFeedbackMessage,
    sendGenericMessage,
    sendOrderMessage,
    sendAutoMessage
}
// module.exports.adminLogged = adminLogged