const dotenv = require('dotenv')
dotenv.config({ path: './config/config.env' })

const express = require('express')
const app = express()
const server = require('http').createServer(app)

const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')
const connectDB = require('./config/database.config')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const MongoStore = require('connect-mongo')
const Handlebars = require('handlebars');

require('./config/auth')

connectDB()

// require('./config/passport')(passport)

//sets our app to use the handlebars engine
app.set('view engine', 'hbs')

//Sets handlebars configurations (we will go through them later on)
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'main',
    extname: 'hbs',
    partialsDir: __dirname + '/views/partials',
    helpers: {
        ifEquals(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        },
        concat(){
            arguments = [...arguments].slice(0, -1);
            return arguments.join('');
        }
    }
}))

// Handlebars.registerHelper('paginate', paginate);
// Handlebars.registerHelper('dateFormat', dateFormatt)

// app.use(express.static('public'))
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(session({
    secret: process.env.SESSION_SECRET || 'tt1r22r1sankar key',
    name: 'sessionId',
    saveUninitialized: false, // don't create session until something stored
    resave: true, //save session if unmodified
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

//Make Flash Global
// app.use((req, res, next) => {
//     res.locals.success_msg = req.flash('success_msg')
//     res.locals.error_msg = req.flash('error_msg')
//     res.locals.warning_msg = req.flash('warning_msg')
//     res.locals.error = req.flash('error')
//     res.locals.success = req.flash('success')
//     next()
// })

//Define Routes here..
const siteRoute = require('./routes/site.router')

app.get('/auth/google', 
    passport.authenticate('google', { scope: ['email', 'profile'] })
)

app.get('/google/callback', 
    passport.authenticate( 'google', {
        successRedirect: '/logged-in',
        failureRedirect: '/'
    })
)

app.get('/auth/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

app.use('/', siteRoute)

// app.use(function (req, res) {
//     res.status(400).render('site/error', {
//         layout: "404",
//         error_msg: 'We are unable to process your request. Please try again',
//     })
// })

const PORT = process.env.ACCESS_PORT || 3300
server.listen(PORT, () => {
    console.log(`Server is currently running on PORT ${PORT}`)
})