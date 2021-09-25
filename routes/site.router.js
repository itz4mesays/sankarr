const router = require('express').Router()
const siteController = require('../app/controllers/SiteController')
const adminController = require('../app/controllers/AdminController')

const passport = require('passport')
const { isLoggedIn } = require('../config/loggedIn')
const UserEnv = require('../app/models/user_env')
const User = require('../app/models/user')
const ConfigSite = require('../app/models/config_site')
const OptionList = require('../app/models/option_list')

const { adminLogged } = require('../config/adminlogged')
const {decodedToken} = require('../config/utils')

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

    return res.redirect('/config-site')
    // return res.send('Config Site saving completed. <a href="/logged-in"> Back to Profile </a>')
})

router.get('/site1/api/v1/:profileapi_key/webhook', adminController.getwebhook)
router.post('/site1/api/v1/:profileapi_key/webhook', adminController.webhook)

router.get('/fetch-response/:type', siteController.fetchList)
router.get('/edit-config/:id', isLoggedIn, siteController.editConfig)

router.post('/edit-config/:id', isLoggedIn, async (req, res) => {

  const filter = { _id: req.params.id };
  const update = { rtype: req.body.populated_List, req: req.body.req, response: req.body.response };

  let updateConfig = await ConfigSite.findOneAndUpdate(filter, update, {
      new: true
  });

  if(updateConfig){
    return res.redirect('/config-site')
  }


  res.redirect("/edit-config/" + req.params.id);

})

router.get('/user-config', isLoggedIn, async (req, res) => {

  const user = await User.find({ email: req.user.email }).lean()

  if(!user)  res.json({statusCode: 400, message: 'Could not process information at the moment'})

  const configList = await ConfigSite.find({uid: user[0]._id},null, {sort: {created_at: -1}})

  if(!configList)  res.json({statusCode: 400, message: 'Could not process it'})

  return res.json({statusCode: 200, message: configList})

})

router.post('/update-config', isLoggedIn, async (req, res) => {

  const filter = { _id: req.body.id };
  const update = { req: req.body.req_q, response: req.body.response };

  let updateConfig = await ConfigSite.findOneAndUpdate(filter, update, {
      new: true
  });

  if(updateConfig){
    return res.json({statusCode: 200, message: 'Update Completed...'})
  }else{
    return res.json({statusCode: 400, message: 'Could not process the operation at the moment'})
  }

})

router.get('/delete-config/:id', async (req, res) => {
  
  const configSite = await ConfigSite.findOneAndRemove({_id: req.params.id})

  if(!configSite) return res.json({statusCode: 400, message: 'Could not process information at the moment'})

  console.log('Record has been deleted successfully')

  return res.json({statusCode: 200, message: 'Record has been deleted successfully...'})
})

module.exports = router
