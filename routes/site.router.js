const router = require('express').Router()
const siteController = require('../app/controllers/SiteController')
const passport = require('passport')
const { isLoggedIn } = require('../config/loggedIn')
const UserEnv = require('../app/models/user_env')

router.get('/', siteController.home)
router.get('/logged-in', isLoggedIn, siteController.loggedIn)
router.get('/edit/:id', isLoggedIn, siteController.edit)
router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const filter = { uid: req.params.id };
    const update = { profileapi_key: req.body.profileapi_key, access_token: req.body.access_token, page_token: req.body.page_token };

    let updateEnv = await UserEnv.findOneAndUpdate(filter, update, {
        new: true
    });

    if(updateEnv){
        res.redirect('/logged-in')
    }

    new UserEnv({
        uid: req.params.id,
        profileapi_key: req.body.profileapi_key, 
        access_token: req.body.access_token, 
        page_token: req.body.page_token
      }).save().then((createdUser)=> {
        res.redirect('/logged-in')
      }).catch(err => res.send('Unable to create new user env.'))
})


module.exports = router
