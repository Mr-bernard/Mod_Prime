const mongoose = require('mongoose')
const {Admin} = require('../models/admin')
const DB = 'mongodb+srv://modelprime:modelprime@model-prime.fhtzg.mongodb.net/modelprime?retryWrites=true&w=majority'
const bcrypt = require('bcrypt')

mongoose.Promise = global.Promise;
mongoose
    .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`database connected successfully`);
    })
    .catch(err => {
        console.log(`database not connected successfully ${err}`);
    });

    


const admin = new Admin({
    fullName:'MODEL PRIME NG',
    email:'modelprime@gmail.com',
    password:'123abcd'
})

//===================== Hash the password and seeding to database======================
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(admin.password, salt, (err, hash) => {
        if (err) throw err;
        admin.password = hash;
        admin.save().then(user => {
            console.log('user saved successfully')
            console.log(admin)
        })
            .catch(err => {
                console.log(err);
            });
    })
})
