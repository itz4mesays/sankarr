const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const mongoose = require('mongoose')
const User = require('../models/user')
const UserEnv = require('../models/user_env')
const ConfigSite = require('../models/config_site')


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
    UserEnv.findOne({profileapi_key: req.params.profileapi_key, access_token: req.body.access_token, page_token : req.body.page_token}).lean().then(user => {
        if(!user) return res.json({statusCode: 400, message: 'Sorry we could not match the token you provided with any user'})

        if(user.status === 1) res.json({statusCode: 400, message: 'This route API cannot be executed at the moment'})

        ConfigSite.findOne({uid: user.uid, req: req.body.req_param}).lean().then(configSite => {
            if(!configSite) return res.json({statusCode: 400, message: 'Sorry no response was found'})

            return res.json({statusCode: 200, message: {response: configSite.response}})

        }).catch(err => {
            return res.json({statusCode: 400, message: err})
        })


        
    }).catch(err => {
        return res.json({statusCode: 400, message: err})
    })
  }
}