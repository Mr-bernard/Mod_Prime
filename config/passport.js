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
          .then((user) => {
            if (!user) {
              return done(null, false, {
                message: "This email is not registered",
              });
            }

            // MATCH PASSWORD
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                console.log(user)
                return done(null, user);
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
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    Admin.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
