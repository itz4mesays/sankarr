var request = require('request')

const sendTextMessage = (sender, token, data) => {
  messageData = {
      text:data
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
    sendAutoMessage
}
// module.exports.adminLogged = adminLogged