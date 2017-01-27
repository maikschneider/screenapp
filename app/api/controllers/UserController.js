/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Passwords = require('machinepack-passwords');

module.exports = {



  /**
   * `UserController.login()`
   */
  login: function (req, res) {

    User.findOne({email: req.param('email')}).exec(function(err, createdUser) {

      if (err) return res.negotiate(err);
      if (!createdUser) return res.notFound();

      Passwords.checkPassword({
        passwordAttempt: req.param('password'),
        encryptedPassword: createdUser.password
      }).exec({

        error: function(err) {
          return res.negotiate(err);
        },

        incorrect: function() {
          return res.notFound();
        },

        success: function() {

          req.session.me = createdUser.id;
          req.session.meName = createdUser.name;

          if (req.wantsJSON) {
            return res.ok('Logged in successfully!');
          }

          res.redirect('/admin');

        }
      });
    });
  },


  /**
   * `UserController.logout()`
   */
  logout: function (req, res) {
    req.session.me = null;

    if (req.wantsJSON) {
      return res.ok('Logged out successfully!');
    }

    return res.redirect('/');
  },


  /**
   * `UserController.signup()`
   */
  signup: function (req, res) {

    User.signup({
      name: req.param('name'),
      email: req.param('email'),
      password: req.param('password')
    }, function (err, user) {

      if (err) return res.negotiate(err);

      req.session.me = user.id;

      if (req.wantsJSON) {
        return res.ok('Signup successful!');
      }

      return res.redirect('/welcome');
    });
  }
};

