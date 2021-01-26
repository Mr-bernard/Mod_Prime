require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const mail = require('../config/mail')
const client_id ='193918065561-0c2b5jd96jp8js75fqu4egip4gtblq2n.apps.googleusercontent.com'
const client_secret = 'oyoR84LU9VDP1rdRHG1x_Mga'
const Redirect_URI = 'https://developers.google.com/oauthplayground'
const refresh_Token  = '1//0449gn0Qauav5CgYIARAAGAQSNwF-L9Ir3pyAVSeixyzYPm3PHHkC8eqEGM7o16FcTWRTkFXmr630goSL9kckkAcU8qAODfh-lfA'


const oauth2Client = new OAuth2(client_id, client_secret, Redirect_URI)

oauth2Client.setCredentials({
  refresh_token : refresh_Token
});
const accessToken = oauth2Client.getAccessToken()

const smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
       type: "OAuth2",
       user: mail.GMAIL_NAME, 
       clientId: client_id,
       clientSecret: client_secret,
       refreshToken: refresh_Token,
       accessToken: accessToken
  },
  tls: {
    rejectUnauthorized: false
  }
})


module.exports = smtpTransport