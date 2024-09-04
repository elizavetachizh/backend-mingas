import LocalStrategy from "passport-local";
const LocalStrategyLocal = LocalStrategy.Strategy;
import User from "../models/user.js";
import bcrypt from "bcryptjs";

export default function Passport(passport) {
  passport.use(
    new LocalStrategyLocal(function (username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) console.log(err);

        if (!user) {
          return done(null, false, { message: "No user found!" });
        }

        bcrypt.compare(password, user.password, function (err, isMatch) {
          if (err) console.log(err);
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Wrong password." });
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      err ? done(err) : done(null, user);
    });
  });
};
