require("dotenv").config();
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const logger = require('morgan')
const sendMail = require('./mail');
const ejs = require (`ejs`)
const session = require('express-session');
const mongoStore = require('connect-mongo')(session)
const bodyParser =require('body-parser')
const flash = require('connect-flash');
const mongoose =  require('mongoose');
const bcrypt = require('bcrypt');
// const { Router } = require('express');
// const DB = require('./config/configurations').MONGO_URI
const {Admin} = require('./models/admin');
const passport = require("passport");
//passport config
require("./config/passport")(passport);
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;


app.use(logger('dev'))
app.use(methodOverride('_method'));


// mongoose config
mongoose.connect('mongodb://localhost/modelPrime', {
         useNewUrlParser: true,
         useUnifiedTopology:true,
         useCreateIndex: true,
         useFindAndModify: false
    })
    .then(() => console.log(`Database connected successfully`))
    .catch(err => console.log(`Database Connection failed ${err.message}`));


//Data parsing

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended: true,
}));



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.ejs');

// bodyParser init
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.json());
app.use(session({
    secret: 'secret',
    cookie: {max: 60000},
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({
        mongooseConnection:mongoose.connection,
        ttl:600 *6000 // 1 hour
    })
    
}))


//passport middleware config
app.use(passport.initialize());
app.use(passport.session());




app.use(flash())
app.use((req, res, next) => {
    res.locals.success_messages = req.flash("success");
    res.locals.error_messages = req.flash("error");
    res.locals.user = req.user ? true : false;
    res.locals.session = req.session;
    next();
  });



// Configure app.post 
app.post('/email', (req, res) => {
    // TODO:
    //send email here
    const { subject, email, text } = req.body;
    console.log('Data', req.body); 

    sendMail(email, subject, text, function (err, data) {
        if (err) {
            res.status(500).json({ message: 'Internal Error' });
        } else {
            res.json({ message: 'Email Sent!!!!' });
        }
     });

})

// ---------ROUTES GROUPING----------------
const userRoutes  = require('./routes/user')
const adminRoutes = require('./routes/admin')


// ----------------USE ROUTES-------------------
app.use('/', userRoutes)
app.use('/admin', adminRoutes)



express()
    .get('/', async (req, res) => {
        if (req.query.key !== process.env.KEY) {
            res.sendStatus(403);
            return;
        };
        await getFtpFile(req, res)
    })

    // ERROR HANDLING OF 404 AND FORWARDING TO THE ERROR HANDLER
app.use((req, res, next) => {
    let pageTitle = "Error404";
    res.status(404,{pageTitle});
  });


// --LISTENING PORT ---------------------
const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`port is listening at port http://localhost:${port}`));