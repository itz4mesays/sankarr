const router = require('express').Router()
const siteController = require('../app/controllers/SiteController')
const passport = require('passport')
const { isLoggedIn } = require('../config/loggedIn')
const UserEnv = require('../app/models/user_env')
const ConfigSite = require('../app/models/config_site')

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
      return res.redirect('/logged-in')
    }

    new UserEnv({
        uid: req.params.id,
        profileapi_key: req.body.profileapi_key, 
        access_token: req.body.access_token, 
        page_token: req.body.page_token
      }).save().then((createdUser)=> {
        return res.redirect('/logged-in')
      }).catch(err => res.send('Unable to create new user env.'))
})

router.get('/config-site', isLoggedIn, siteController.config)
router.post('/config-site/:id', isLoggedIn, async (req, res) => {
  let data = req.body

  const jsonData = Object.values(Object.entries(data)
    .reduce((acc, [ key, value ]) => {
        Object.values(value).forEach((data, i) => {
        if (!acc[i]) acc[i] = { };
        acc[i][key] = data;
        });
        return acc;
    }, {  }));

    jsonData.forEach((value, index, self) => {      
      new ConfigSite({
        uid: req.params.id,
        rtype: value.populated_List, 
        req: value.Reqq, 
        response: value.Response, 
      }).save().then((rec)=> {
        console.log(`${value.populated_List} has been saved into the db.`)
      }).catch(err => {
        console.log(`${err}`)
      })
    })

    return res.send('Config Site saving completed. <a href="/logged-in"> Back to Profile </a>')
})

module.exports = router
