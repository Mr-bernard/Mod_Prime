const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');


const auth = {
    auth: {
        api_key: 'c9fb80ecf71a45e1604e5c46f652d0b6-0afbfc6c-6e608882',
        domain: 'sandbox811ce843c7b943c79ea85acb1fbc7ab7.mailgun.org'
    }
};

const transporter = nodemailer.createTransport(mailGun(auth));




const sendMail = (email, subject, text, cb) => {
    const mailOption = {
    from: email,
    to: 'ituahbernard01@gmail.com',
    subject,
    text

    };

    transporter.sendMail(mailOption, (err, data) => {
        if (err) {
            cb(err, null);
        } else {
            cb(null, data);
        }
    });
    
}


module.exports = sendMail;