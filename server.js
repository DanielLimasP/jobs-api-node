const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const exhbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

const app = express()
require('./config/passport')
require('./database')

// Settings
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exhbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}))
app.set('view engine', '.hbs')

// Middlewares
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(session({
    secret: "mysecretapp",
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

/**
 *  Deprecated Scheme
 app.get('/', (req, res)=>{
     res.send("Jobs API")
 })
 * 
 */

 //Global Variables
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null

    next()
})

// Routes
const auth = require('./routes/auth')
const jobs = require('./routes/jobs')
const admin = require('./routes/admin')

app.use(require('./routes/index'))
app.use('/auth', auth)
app.use('/jobs', jobs)
app.use('/admin', admin)

//Static Files
app.use(express.static(path.join(__dirname, 'public'))) 
module.exports = app

//Server Initialize
app.listen(app.get('port'), ()=>{
    console.log('Server on port', app.get('port'))
})
