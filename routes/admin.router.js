const router = require('express').Router()
const adminController = require('../app/controllers/AdminController')
const passport = require('passport')
const { adminLogged } = require('../config/adminlogged')
const UserEnv = require('../app/models/user_env')
const ConfigSite = require('../app/models/config_site')

router.get('/list-users/:email', adminLogged, adminController.list_users)
router.post('/update/', adminController.update)

module.exports = router
