const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const mongoose = require('mongoose')
const User = require('../models/user')
const UserEnv = require('../models/user_env')

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
      console.log(req.body.status)
  }
}