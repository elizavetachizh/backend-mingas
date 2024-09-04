import express from "express";
const adminUsersRouter = express.Router();
import passport from "passport";
import bcrypt from "bcryptjs";

// Get Users model
import User from "../../models/user.js";

/*
 * GET register
 */
adminUsersRouter.get("/register", function (req, res) {
  res.render("register", {
    title: "Register",
  });
});

/*
 * POST register
 */
adminUsersRouter.post("/register", function (req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;

  req.checkBody("name", "Name is required!").notEmpty();
  req.checkBody("email", "Email is required!").isEmail();
  req.checkBody("username", "Username is required!").notEmpty();
  req.checkBody("password", "Password is required!").notEmpty();
  req.checkBody("password2", "Passwords do not match!").equals(password);

  var errors = req.validationErrors();

  if (errors) {
    res.render("register", {
      errors,
      user: null,
      title: "Register",
    });
  } else {
    User.findOne({ username: username }, function (err, user) {
      if (err) console.log(err);

      if (user) {
        req.flash("danger", "Username exists, choose another!");
        res.redirect("/admin/users/register");
      } else {
        var user = new User({
          name,
          email,
          username,
          password,
          admin: 0,
        });
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) console.log(err);

            user.password = hash;

            user.save(function (err) {
              if (err) {
                console.log(err);
              } else {
                req.flash("success", "You are now registered!");
                res.redirect("/admin/users/login");
              }
            });
          });
        });
      }
    });
  }
});

/*
 * GET login
 */
adminUsersRouter.get("/login", function (req, res) {
  if (res.locals.user) res.redirect("/admin");
  res.render("login", {
    title: "Log in",
  });
});

/*
 * POST login
 */
adminUsersRouter.post("/login", function (req, res, next) {
  req.checkBody("username", "Username is required!").notEmpty();
  req.checkBody("password", "Password is required!").notEmpty();
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/admin/users/login",
    failureFlash: true,
  })(req, res, next);
});

/*
 * GET logout
 */
adminUsersRouter.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/admin/users/login");
  });
});

// Exports
export default adminUsersRouter;
