const localStrategy = require("passport-local").Strategy;
const mongooose = require("mongoose");
const bcrypt = require("bcrypt");
const {Admin} = require("../models/admin");

module.exports = function (passport) {
  passport.use("admin",
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      (email, password, done) => {
        // MATCH USER
        Admin.findOne({ email: email })
          .then((admin) => {
            if (!admin) {
              return done(null, false, {
                message: "This email is not registered",
              });
            }

            // MATCH PASSWORD
            bcrypt.compare(password, admin.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, admin);
              } else {
                return done(null, false, { message: "Password incorrect" });
              }
            });
          })
          .catch((err) => console.log(err));
      }
    )
  );

  // SERIALIZE AND DESERIALIZE USER
  passport.serializeUser((admin, done) => {
    done(null, admin.id);
  });
  passport.deserializeUser((id, done) => {
    Admin.findById(id, (err, admin) => {
      done(err, admin);
    });
  });
};
