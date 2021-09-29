var request = require('request')

const sendTextMessage = (sender, token, data) => {
  messageData = {
      text:data
  }
  sendAutoMessage(sender, token, messageData)
}
const sendActionTyping = (sender, token, data) => {
  if(data==1){ action = "typing_on"}
  if(data==0){ action = "typing_off"}
  messageData = {
    recipient:{
      id:"sender"
    },
    sender_action:"typing_on"
  }
  sendAutoMessage(sender, token, messageData)
}
const sendPostbackResponse = (sender, token, data) => {
  sendAutoMessage(sender, token, data)
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
    sendPostbackResponse,
    sendActionTyping,
    sendButtonMessage,
    sendImageMessage,
    sendVideoMessage,
    sendFeedbackMessage,
    sendGenericMessage,
    sendOrderMessage,
    sendAutoMessage
}
// module.exports.adminLogged = adminLogged