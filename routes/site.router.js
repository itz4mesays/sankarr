const router = require('express').Router()
const siteController = require('../app/controllers/SiteController')
const passport = require('passport')
const { isLoggedIn } = require('../config/loggedIn')

router.get('/', siteController.home)

// router.get('/auth/google', (req, res) => {
//     passport.authenticate('google', { scope: ['email', 'profile'] })
// })

// router.get('/google/callback', (req, res) => {
//     passport.authenticate( 'google', {
//         successRedirect: '/logged-in',
//         failureRedirect: '/'
//     })
// })

router.get('/logged-in', isLoggedIn, siteController.loggedIn)


module.exports = router
